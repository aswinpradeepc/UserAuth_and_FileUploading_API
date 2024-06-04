const jwt = require('jsonwebtoken');
require('dotenv').config(); // Load environment variables from .env file

// Replace this with the JWT token you want to inspect
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NjVlY2VjMTY0ODdjZjJlMTNlNTQ3NjUiLCJpYXQiOjE3MTc0ODk0NzksImV4cCI6MTcxNzQ5MzA3OX0.p8te0t2unbotUeXGUxuIJnAV7Cf2l4OzGAnQrnndP6M';

try {
    const decoded = jwt.verify(token, 'N3v3rSh@r3Th1sS3cr3tK3y');
    console.log('Decoded JWT payload:', decoded);
} catch (err) {
    console.error('Error decoding JWT:', err);
}