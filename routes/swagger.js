const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    swaggerDefinition: {
        info: {
            title: 'API Documentation',
            version: '1.0.0',
            description: 'Documentation for API endpoints',
        },
        components: {
            schemas: {
                UploadRequest: {
                    type: 'object',
                    properties: {
                        csvFile: {
                            type: 'string',
                            format: 'binary', // Optional for better Swagger UI display
                        },
                    },
                    required: ['csvFile'],
                },
            },
        },
        basePath: '/',
    },
    apis: ['./routes/*.js'], // Path to the API routes
};

const specs = swaggerJsdoc(options);

module.exports = specs;


