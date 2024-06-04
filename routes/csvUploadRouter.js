const express = require('express');
const multer = require('multer');
const path = require('path');
const authMiddleware = require('../middlewares/authMiddleware');

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

const upload = multer({ storage });

// Upload CSV endpoint (only accessible to authenticated users)
router.post('/upload', authMiddleware, upload.single('csvFile'), async (req, res) => {
    try {
        // Here you can add the file to a queue for processing
        // For now, just sending a success response
        res.status(200).json({ message: 'File uploaded successfully', filePath: req.file.path });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

const csvQueue = require('../queues/queue');

router.post('/upload', authMiddleware, upload.single('csvFile'), async (req, res) => {
    try {
        const job = await csvQueue.add({ filePath: req.file.path }, { attempts: 5, backoff: 5000 });
        res.status(200).json({ message: 'File uploaded and processing started', jobId: job.id });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;
