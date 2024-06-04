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
                // Your schemas will be added here
            }
        },
        basePath: '/',
    },
    apis: ['./routes/*.js'], // Path to the API routes
};

const specs = swaggerJsdoc(options);

module.exports = specs;
