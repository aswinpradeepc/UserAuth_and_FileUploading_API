const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const csvUploadRouter = require('./routes/csvUploadRouter');
const statusRouter = require('./routes/statusRouter');
require('dotenv').config();
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./routes/swagger');
const morgan = require('morgan'); // Import morgan
const fs = require('fs'); // Import fs for logging to file
const path = require('path'); // Import path for resolving file paths

const app = express();

// Create a log directory if it doesn't exist
const logDirectory = path.join(__dirname, 'logs');
if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory);
}

// Create a write stream for log files
const accessLogStream = fs.createWriteStream(path.join(logDirectory, 'access.log'), { flags: 'a' });

// Set up the logger
app.use(morgan('combined', { stream: accessLogStream }));

// Routes
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use('/api/auth', authRoutes);
app.use('/api/csv', csvUploadRouter);
app.use('/api/status', statusRouter);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Failed to connect to MongoDB', err);
});

// Catch 404 and forward to error handler
app.use((req, res, next) => {
    res.status(404).json({
        error: 'Not Found',
        message: `The requested URL ${req.originalUrl} was not found on this server. Please check the request method (${req.method}) and the URL you are trying to access.`
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Error stack:', err.stack);
    res.status(500).json({
        error: 'Internal Server Error',
        message: 'Something went wrong on our end. Please try again later or contact support if the issue persists.'
    });
});

// Fallback route
app.all('*', (req, res) => {
    res.status(404).json({
        error: 'Not Found',
        message: `The requested URL ${req.originalUrl} was not found on this server. Please check the request method (${req.method}) and the URL you are trying to access.`
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});