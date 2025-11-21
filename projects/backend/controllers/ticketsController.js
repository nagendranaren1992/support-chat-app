const { uploadFileToGCS } = require("../services/gcsUploader");

exports.createTicket = async (req, res) => {
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

    // Classify priority with AI, save ticket, etc., as before

    // Return response with URLs etc.
  } catch (error) {
    console.error(error);
    res.status(500).send("Error uploading files");
  }
};
