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

// Initialize the multer upload instance with size limit and file type check
const upload = multer({
    storage,
    limits: {
        fileSize: 150 * 1024 * 1024 // 150 MB, matching your Nginx setting
    },
    fileFilter: (req, file, cb) => {
        if (path.extname(file.originalname).toLowerCase() === '.csv') {
            cb(null, true);
        } else {
            cb(new Error('Only CSV files are allowed'), false);
        }
    }
});

/**
 * @swagger
 * /upload:
 *   post:
 *     summary: Uploads a CSV file and queues it for processing
 *     tags: [CSV]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               csvFile:
 *                 type: string
 *                 format: binary
 *
 *     responses:
 *       202:
 *         description: File uploaded and queued for processing
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 jobId:
 *                   type: string
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.post('/upload', authMiddleware, upload.single('csvFile'), async (req, res) => {
    try {
        const job = await csvQueue.add({
            filePath: req.file.path,
            userId: req.user.userId  // Assuming your authMiddleware attaches user info
        }, { attempts: 5, backoff: 5000 });
        res.status(202).json({ message: 'File uploaded and queued for processing', jobId: job.id });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;
