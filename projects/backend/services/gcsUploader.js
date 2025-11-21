require("dotenv").config();

const { Storage } = require("@google-cloud/storage");

// Path to JSON key file downloaded from GCP (from .env file)
const keyPath = process.env.GCP_KEYFILE_PATH;
const bucketName = process.env.GCP_BUCKET_NAME;

const storage = new Storage({ keyFilename: keyPath });
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
