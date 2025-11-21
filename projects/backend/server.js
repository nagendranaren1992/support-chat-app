require("dotenv").config();

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const multer = require("multer");
const { Pool } = require("pg");
const { Storage } = require("@google-cloud/storage");
const OpenAI = require("openai");
const crypto = require("crypto");

const app = express();

app.use(cors());
app.use(bodyParser.json());

// PostgreSQL Setup
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Google Cloud Storage Setup
const storage = new Storage({ keyFilename: process.env.GCP_KEYFILE_PATH });
const bucket = storage.bucket(process.env.GCP_BUCKET_NAME);

// OpenAI Setup
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Multer Setup for memory storage
const upload = multer({ storage: multer.memoryStorage() });

async function uploadFileToGCS(file) {
  // Use hash-based filename to ensure URL stays short and unique
  // This prevents issues with VARCHAR(255) database column limits
  const fileHash = crypto
    .createHash("md5")
    .update(file.buffer)
    .digest("hex")
    .substring(0, 16);
  const timestamp = Date.now();

  // Get file extension
  const fileExt = file.originalname.substring(
    file.originalname.lastIndexOf(".")
  );

  // Create short, unique filename: timestamp_hash.ext
  const filename = `${timestamp}_${fileHash}${fileExt}`;

  const blob = bucket.file(filename);
  const blobStream = blob.createWriteStream({
    resumable: false,
    contentType: file.mimetype,
  });

  return new Promise((resolve, reject) => {
    blobStream.on("error", (err) => reject(err));
    blobStream.on("finish", () => {
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
      resolve(publicUrl);
    });
    blobStream.end(file.buffer);
  });
}

async function classifyPriority(description) {
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content:
          "You are an assistant that classifies support ticket priority. Respond with ONLY one word: 'low', 'medium', or 'high'. Do not include any explanation or additional text.",
      },
      {
        role: "user",
        content: `Classify the priority of the ticket (respond with ONLY: low, medium, or high) based on this description: ${description}`,
      },
    ],
    max_tokens: 10, // Limit response to ensure short output
  });

  let priority = response.choices[0].message.content.trim().toLowerCase();

  // Extract only valid priority values (low, medium, high)
  const validPriorities = ["low", "medium", "high"];
  const foundPriority = validPriorities.find((p) => priority.includes(p));

  // Use found priority or default to 'medium', then limit to 100 chars
  priority = foundPriority || "medium";

  // Ensure it doesn't exceed 100 characters (safety check)
  return priority.substring(0, 100);
}

// POST /api/tickets - Create new support ticket
app.post(
  "/api/tickets",
  upload.fields([
    { name: "screenshot", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { description } = req.body;

      let screenshotUrl = null;
      let videoUrl = null;

      if (req.files["screenshot"]) {
        screenshotUrl = await uploadFileToGCS(req.files["screenshot"][0]);
      }
      if (req.files["video"]) {
        videoUrl = await uploadFileToGCS(req.files["video"][0]);
      }

      const priority = await classifyPriority(description);

      // Ensure priority doesn't exceed 100 characters (additional safety check)
      const limitedPriority = priority.substring(0, 100);

      const query = `
      INSERT INTO support_tickets (description, screenshot_path, video_path, priority, status)
      VALUES ($1, $2, $3, $4, $5) RETURNING *;
    `;
      const values = [
        description,
        screenshotUrl,
        videoUrl,
        limitedPriority,
        "open",
      ];
      const { rows } = await pool.query(query, values);

      res.status(201).json(rows[0]);
    } catch (error) {
      console.error("Error creating ticket:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

// GET /api/tickets - List all tickets sorted by priority and creation time
app.get("/api/tickets", async (req, res) => {
  try {
    const query = `
      SELECT * FROM support_tickets
      ORDER BY CASE priority
        WHEN 'high' THEN 1
        WHEN 'medium' THEN 2
        WHEN 'low' THEN 3
        ELSE 4 END, created_at DESC;
    `;
    const { rows } = await pool.query(query);
    res.json(rows);
  } catch (error) {
    console.error("Error fetching tickets:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/chat", async (req, res) => {
  try {
    const { message, chatHistory } = req.body;

    // Prepare messages for OpenAI with chat history for context
    const messages = [
      { role: "system", content: "You are a helpful support chatbot." },
      ...(chatHistory || []),
      { role: "user", content: message },
    ];

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: messages,
      max_tokens: 150,
      temperature: 0.7,
    });

    const botReply = response.choices[0].message.content;
    res.json({ reply: botReply });
  } catch (error) {
    console.error("Chat AI error:", error);
    res.status(500).json({ error: "Failed to generate AI response" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
