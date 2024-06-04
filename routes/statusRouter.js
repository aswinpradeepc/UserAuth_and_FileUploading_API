const express = require('express');
const csvQueue = require('../queues/queue');

const router = express.Router();

router.get('/status/:id', async (req, res) => {
    const job = await csvQueue.getJob(req.params.id);
    if (job) {
        const state = await job.getState();
        const progress = job.progress();
        res.status(200).json({ state, progress });
    } else {
        res.status(404).json({ message: 'Job not found' });
    }
});

module.exports = router;
