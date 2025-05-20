const Media = require("../models/media")
const uploadMediaWithTitle = async (req, res) => {
    try {
        const { title, media } = req.body;

        if (!title || !media || !Array.isArray(media)) {
            return res.status(400).json({ error: "Title and media are required." });
        }

        const newEntry = new Media({ title, media });
        await newEntry.save();

        return res.status(201).json({ message: "Media uploaded successfully.", data: newEntry });
    } catch (error) {
        console.error("Upload failed:", error);
        return res.status(500).json({ error: "Server error" });
    }
};

module.exports = { uploadMediaWithTitle }


