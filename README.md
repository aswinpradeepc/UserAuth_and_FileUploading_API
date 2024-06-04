# User Authentication & CSV Processing API

This project is a robust API service built with Node.js and Express, providing user authentication and CSV file processing capabilities. It leverages MongoDB for data storage, Swagger for API documentation, Multer for file uploads, and Bull for efficient queue management.

## Features

- **User Authentication**
    - Register new users
    - Log in existing users with JWT
- **CSV File Processing**
    - Upload CSV files
    - Asynchronous processing using queues
- **Technologies**
    - Node.js & Express.js
    - MongoDB
    - Swagger (OpenAPI)
    - Multer
    - Bull (Redis-based queue)

Set up environment variables:
   Create a `.env` file in the root directory with the following:
   ```
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/your_database
   JWT_SECRET=your_super_secret_key
   ```

## API Endpoints

### User Authentication

#### Register a New User
- **POST** `/auth/register`
- **Body**: `{ "username": "john_doe", "password": "secure123!" }`
- **Success Response**: 201 Created
  ```json
  { "message": "User registered successfully" }
  ```

#### User Login
- **POST** `/auth/login`
- **Body**: `{ "username": "john_doe", "password": "secure123!" }`
- **Success Response**: 200 OK
  ```json
  { "token": "your.jwt.token" }
  ```

### CSV File Upload & Processing

#### Upload CSV File
- **POST** `/upload`
- **Header**: `Authorization: Bearer your.jwt.token`
- **Body**: `form-data` with key `file` (type: file)
- **Success Response**: 202 Accepted
  ```json
  { "message": "CSV file queued for processing", "jobId": "job_123456" }
  ```

## Queue Implementation

We use Bull, a Redis-based queue library, to handle the asynchronous processing of uploaded CSV files. This ensures that large file uploads don't block the main thread and provides a smooth user experience.

1. File Upload Flow:
   a. User uploads a CSV file.
   b. File is saved using Multer.
   c. A job is added to the Bull queue with the file path.
   d. 202 Accepted is returned with a job ID.

2. Queue Processing:
   a. Worker processes pick up jobs from the queue.
   b. CSV file is read and processed.
   c. Data is inserted into MongoDB.
   d. Job status is updated (completed or failed).

## API Documentation

Swagger (OpenAPI) to provide interactive API documentation. 

- Access Swagger UI: [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

## Security

- Passwords are hashed using bcrypt.
- JWT is used for stateless authentication.
- CORS is configured to restrict origins.