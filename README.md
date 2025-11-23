# 🖥️ Project Management & Admin Dashboard

![Type](https://img.shields.io/badge/Type-Frontend-orange)
![Role](https://img.shields.io/badge/Role-Administration-red)
![React](https://img.shields.io/badge/React-18-blue)

## 📝 About This Module

The **Project Management Dashboard** is the operational heart of the system. It provides a robust interface for defining the organizational structure, managing personnel, and controlling the flow of work. This is where data is created, modified, and governed.

## 🌟 Core Functionalities

### 👥 User & Role Management (RBAC)
*   **Admin Users:** Full control over system settings and user creation.
*   **Worker Users:** Restricted access focused on task execution.

### 📋 Comprehensive Task Management
*   **Task Creation:** Define tasks with titles, descriptions, and deadlines.
*   **Task Assignment:** Assign tasks to specific Workers.
*   **Sub-Menus:** Create sub-menus or sub-items for granular organization.

### 📅 Persian Calendar Support
*   Built-in support for **Jalali dates** using `moment-jalaali` and `react-multi-date-picker`.

## 📂 Project Structure

```
src/
├── api/              # API integration logic (Axios)
├── components/       # UI Components (Forms, Tables, etc.)
├── utils/            # Utility functions
├── App.js            # Main routing and layout logic
└── index.js          # Entry point
```

## 🛠️ Technical Setup

### Dependencies
*   **React:** v18.3.1
*   **Tailwind CSS:** v3.0.0
*   **Axios:** v1.10.0
*   **React Router DOM:** v6.30.1

### Development
To run this module in standalone mode for development:

```bash
npm install
npm start
```

The app will run on `http://localhost:3000`.
