require("dotenv").config();

const { Storage } = require("@google-cloud/storage");
const fs = require("fs");
const path = require("path");

const bucketName = process.env.GCP_BUCKET_NAME;

// Support both file-based credentials (local) and JSON string credentials (production)
let storage;
if (process.env.GCP_CREDENTIALS_JSON) {
  // For production (Render, etc.) - credentials as JSON string
  const credentials = JSON.parse(process.env.GCP_CREDENTIALS_JSON);
  storage = new Storage({ credentials });
} else if (process.env.GCP_KEYFILE_PATH) {
  // For local development - credentials from file path
  const keyPath = process.env.GCP_KEYFILE_PATH;
  
  // Check if file exists and is accessible
  if (fs.existsSync(keyPath)) {
    storage = new Storage({ keyFilename: keyPath });
  } else {
    console.error(`GCP credentials file not found at: ${keyPath}`);
    throw new Error(`GCP credentials file not found. Please set GCP_CREDENTIALS_JSON or ensure GCP_KEYFILE_PATH points to a valid file.`);
  }
} else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  // Standard GCP environment variable
  storage = new Storage({ keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS });
} else {
  // Try to use default credentials (for GCP environments)
  storage = new Storage();
}

const bucket = storage.bucket(bucketName);

async function uploadFileToGCS(file) {
  const blob = bucket.file(`${Date.now()}_${file.originalname}`);
  const blobStream = blob.createWriteStream({
    resumable: false,
    contentType: file.mimetype,
    predefinedAcl: "publicRead", // Optional, for public access
  });

  return new Promise((resolve, reject) => {
    blobStream.on("error", (err) => reject(err));
    blobStream.on("finish", () => {
      const publicUrl = `https://storage.googleapis.com/${bucketName}/${blob.name}`;
      resolve(publicUrl);
    });
    blobStream.end(file.buffer);
  });
}

module.exports = { uploadFileToGCS };
