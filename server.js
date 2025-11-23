// server.js
// A Node.js server for authentication and data management using MongoDB and Mongoose

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('./config/db'); // Import database connection function
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger'); // فایل swagger.js که swagger-jsdoc ساخته

// Import route modules
const userRoutes = require('./routes/userRoutes');
const taskRoutes = require('./routes/taskRoutes');
const reportLinkRoutes = require('./routes/reportLinkRoutes');
const reportSubCategoryRoutes = require('./routes/reportSubCategoryRoutes');

const app = express();
const PORT = 5000; // Server port, defaults to 5000

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors()); // Enable CORS for all origins (for development)
app.use(bodyParser.json()); // For parsing JSON requests

// Use route modules
app.use('/users', userRoutes); // All user-related routes will be prefixed with /users
app.use('/tasks', taskRoutes); // All task-related routes will be prefixed with /tasks
app.use('/reportLinks', reportLinkRoutes); // All report link-related routes will be prefixed with /reportLinks
app.use('/reportSubCategories', reportSubCategoryRoutes); // All report sub-category routes will be prefixed with /reportSubCategories

// Swagger UI setup
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Start the server
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}.`);
  console.log(`MongoDB URI: mongodb://localhost:2900/project_dashboard`); // Hardcoded URI for logging
}).on('error', (err) => { // Add error listener
  console.error('Error starting Express server:', err);
  process.exit(1); // Exit Node.js process on error
});
