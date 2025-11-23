# ⚙️ Node.js Core Backend Service

![Environment](https://img.shields.io/badge/Environment-Node.js-green?logo=nodedotjs)
![Database](https://img.shields.io/badge/Database-MongoDB-green?logo=mongodb)
![Documentation](https://img.shields.io/badge/Docs-Swagger-yellow?logo=swagger)

## 📝 About This Module

**My-Backend** is the server-side logic layer that powers the entire application ecosystem. Written in **Node.js**, it handles all data processing, business logic execution, authentication, and database interactions. It acts as the single source of truth for both the Gantt Chart and the Management Dashboard.

## 🔧 Technical Architecture

### 🗄️ Database
*   **MongoDB:** Connects to a MongoDB instance (default port 2900 on host, 27017 in container).
*   **Models:** `User`, `Task`, `ReportLink`, `ReportSubCategory`.

### 🔌 API & Networking
*   **Port:** Defaults to `5000`.
*   **CORS:** Enabled for development.
*   **Security:** Uses `bcrypt` for password hashing.

### 📖 Swagger API Documentation
*   **Endpoint:** `/api-docs`
*   **Library:** `swagger-jsdoc`, `swagger-ui-express`

## 📂 Project Structure

```
.
├── config/           # DB connection and Swagger config
├── middleware/       # Express middleware
├── models/           # Mongoose schemas
├── routes/           # API route definitions
├── createAdminUser.js # Script to seed admin user
└── server.js         # Main server entry point
```

## 🚀 Endpoints Overview

*   `/users` - User management (Auth, CRUD).
*   `/tasks` - Task management.
*   `/reportLinks` - Report link management.
*   `/reportSubCategories` - Report sub-category management.

## 🏃 execution

In the Docker environment, this service waits for the MongoDB container to be healthy before starting.

```bash
# Standard local run
npm install
npm start
```
