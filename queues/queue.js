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