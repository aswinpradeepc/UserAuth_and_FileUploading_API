const Queue = require('bull');
const csvParser = require('csv-parser');
const fs = require('fs');
const path = require('path');
const redis = require('ioredis');

const csvQueue = new Queue('csvQueue', {
    redis: {
        host: '127.0.0.1',
        port: 6379
    }
});

// Process CSV files
csvQueue.process(async (job) => {
    const { filePath } = job.data;
    try {
        const results = [];
        fs.createReadStream(filePath)
            .pipe(csvParser())
            .on('data', (data) => results.push(data))
            .on('end', () => {
                console.log('CSV Processed:', results);
                // Here, you can update the database or perform other operations
                job.progress(100);
                return Promise.resolve();
            });
    } catch (error) {
        console.error('Error processing CSV:', error);
        return Promise.reject(error);
    }
});

// Retry logic
csvQueue.on('failed', (job, err) => {
    if (job.attemptsMade < 5) {
        job.retry();
    } else {
        console.error(`Job failed after ${job.attemptsMade} attempts:`, err);
    }
});

module.exports = csvQueue;
