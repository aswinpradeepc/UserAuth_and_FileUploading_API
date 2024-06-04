const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

const baseURL = 'http://localhost:3000/api';

// Helper function to print results
const printResult = (message, data) => {
    console.log(message);
    console.log(JSON.stringify(data, null, 2));
};

// Register a user
const registerUser = async (username, password) => {
    const response = await axios.post(`${baseURL}/auth/register`, { username, password });
    printResult('User registered successfully:', response.data);
};

// Log in to get a token
const loginUser = async (username, password) => {
    const response = await axios.post(`${baseURL}/auth/login`, { username, password });
    printResult('User logged in successfully. Token received:', response.data);
    return response.data.token;
};

// Upload a CSV file
const uploadCSV = async (token, filePath) => {
    const form = new FormData();
    form.append('csvFile', fs.createReadStream(filePath));

    const response = await axios.post(`${baseURL}/csv/upload`, form, {
        headers: {
            ...form.getHeaders(),
            'Authorization': `Bearer ${token}`
        }
    });
    printResult('CSV file uploaded successfully:', response.data);
    return response.data; // Return response data without jobId
};

// Main function to run the demo
const runDemo = async () => {
    const csvFilePath = 'sample.csv';
    const usersCount = 10000;
    const uploadPromises = [];

    try {
        // Register, login, and upload CSV for each user
        for (let i = 0; i < usersCount; i++) {
            const username = `user${i}_${Date.now()}`;
            const password = `password${i}`;
            const registerPromise = registerUser(username, password);
            const loginPromise = registerPromise.then(() => loginUser(username, password));
            const uploadPromise = loginPromise.then(token => uploadCSV(token, csvFilePath));
            uploadPromises.push(uploadPromise);
        }

        // Wait for all uploads to complete
        const uploadResults = await Promise.all(uploadPromises);
        console.log('All CSV files uploaded successfully:');
        uploadResults.forEach(result => {
            console.log(result);
        });
    } catch (error) {
        console.error('Error during demo:', error.response ? error.response.data : error.message);
    }
};

runDemo();
