// const Queue = require('bull');
// const csvParser = require('csv-parser');
// const fs = require('fs');
// const path = require('path');
// const redis = require('ioredis');
//
// const csvQueue = new Queue('csvQueue', {
//     redis: {
//         host: '127.0.0.1',
//         port: 6379
//     }
// });
//
// // Process CSV files
// csvQueue.process(async (job) => {
//     const { filePath } = job.data;
//     try {
//         const results = [];
//         fs.createReadStream(filePath)
//             .pipe(csvParser())
//             .on('data', (data) => results.push(data))
//             .on('end', () => {
//                 console.log('CSV Processed:', results);
//                 // Here, you can update the database or perform other operations
//                 job.progress(100);
//                 return Promise.resolve();
//             });
//     } catch (error) {
//         console.error('Error processing CSV:', error);
//         return Promise.reject(error);
//     }
// });
//
// // Retry logic
// csvQueue.on('failed', (job, err) => {
//     if (job.attemptsMade < 5) {
//         job.retry();
//     } else {
//         console.error(`Job failed after ${job.attemptsMade} attempts:`, err);
//     }
// });
//
// module.exports = csvQueue;

const Queue = require('bull');
const fs = require('fs');
const csvParser = require('csv-parser');
const CsvData = require('../models/CsvData');

const csvQueue = new Queue('csvProcessing', {
    redis: { port: 6379, host: '127.0.0.1' }
});

csvQueue.process(async (job) => {
    const { filePath, userId } = job.data;
    const results = [];

    return new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
            .pipe(csvParser())
            .on('data', (data) => results.push(data))
            .on('end', async () => {
                try {
                    for (const row of results) {
                        await CsvData.create({ data: row, uploadedBy: userId });
                    }
                    fs.unlinkSync(filePath); // Delete the file after processing
                    resolve({ message: 'CSV data stored in MongoDB' });
                } catch (error) {
                    reject(error);
                }
            })
            .on('error', (error) => {
                reject(error);
            });
    }).catch((error) => {
        throw error;
    });
});

module.exports = csvQueue;