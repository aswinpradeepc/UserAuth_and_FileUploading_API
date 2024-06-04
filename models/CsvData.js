const mongoose = require('mongoose');

const CsvDataSchema = new mongoose.Schema({
    data: mongoose.Schema.Types.Mixed,
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    uploadedAt: { type: Date, default: Date.now }
}, { strict: false });

module.exports = mongoose.model('CsvData', CsvDataSchema);

