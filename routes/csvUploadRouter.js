const express = require('express');
const multer = require('multer');
const path = require('path');
const authMiddleware = require('../middlewares/authMiddleware');
const csvQueue = require('../queues/queue');

const router = express.Router();

// Set up storage and file naming
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

// Initialize the multer upload instance
const upload = multer({ storage });

router.post('/upload', authMiddleware, upload.single('csvFile'), async (req, res) => {
    try {
        const job = await csvQueue.add({
            filePath: req.file.path,
            userId: req.user._id  // Assuming your authMiddleware attaches user info
        }, { attempts: 5, backoff: 5000 });
        res.status(202).json({ message: 'File uploaded and queued for processing', jobId: job.id });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;