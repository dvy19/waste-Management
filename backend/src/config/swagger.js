const swaggerJsdoc = require("swagger-jsdoc");
const path = require("path");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Waste Management API",
      version: "1.0.0",
      description: "API documentation for Waste Management backend",
    },
    servers: [
      {
        url: "http://localhost:5000/api",
      },
    ],
  },

  apis: [path.join(__dirname, "routes", "*.js")],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;