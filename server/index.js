require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");

const app = express();
const upload = multer({ dest: "uploads/" });

app.use(cors());
app.use(express.json());

console.log("ANTHROPIC_API_KEY:", process.env.ANTHROPIC_API_KEY);

// POST /api/ask - Accepts text and multiple images, sends to Anthropic API
app.post("/api/ask", upload.array("images"), async (req, res) => {
  try {
    const { message } = req.body;
    let imageBase64s = [];
    if (req.files && Array.isArray(req.files)) {
      for (const file of req.files) {
        // Read image as base64
        const base64 = fs.readFileSync(file.path, { encoding: "base64" });
        imageBase64s.push({
          data: base64,
          mimetype: file.mimetype,
          path: file.path,
        });
        // Clean up uploaded file
        fs.unlinkSync(file.path);
      }
    }

    // Prepare Anthropic API payload
    const contentBlocks = [];
    if (message) {
      contentBlocks.push({ type: "text", text: message });
    }
    if (imageBase64s.length > 0) {
      for (const img of imageBase64s) {
        contentBlocks.push({
          type: "image",
          source: {
            type: "base64",
            media_type: img.mimetype,
            data: img.data,
          },
        });
      }
    }
    const anthropicPayload = {
      model: "claude-3-opus-20240229",
      max_tokens: 1024,
      messages: [{ role: "user", content: contentBlocks }],
    };

    // Debug: Log headers before sending
    console.log("Sending Anthropic headers:", {
      "x-api-key": process.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    });

    // Call Anthropic API
    const response = await axios.post(
      "https://api.anthropic.com/v1/messages",
      anthropicPayload,
      {
        headers: {
          "x-api-key": process.env.ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
          "content-type": "application/json",
        },
      }
    );

    // Return AI response
    const aiText = Array.isArray(response.data.content)
      ? response.data.content
          .filter((block) => block.type === "text")
          .map((block) => block.text)
          .join("\n")
      : "";
    res.json({
      success: true,
      ai: aiText,
    });
  } catch (error) {
    console.error(
      "Anthropic API error:",
      error.response?.data || error.message
    );
    res
      .status(500)
      .json({ success: false, error: error.response?.data || error.message });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Anthropic proxy server running on port ${PORT}`);
});
