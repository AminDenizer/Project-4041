# 📊 Gantt Chart & AI Visualization Interface

![Type](https://img.shields.io/badge/Type-Frontend-orange)
![Feature](https://img.shields.io/badge/Feature-AI_Powered-purple)
![React](https://img.shields.io/badge/React-19-blue)

## 📝 About This Module

The **Gantt Chart Project** is a specialized frontend application designed to provide a high-level visual representation of project timelines. Unlike standard list views, this module focuses on temporal relationships, dependencies, and granular task analysis using Artificial Intelligence.

## ✨ Key Features

### 🗓️ Interactive Gantt Timeline
*   **Visual Roadmap:** Renders tasks as bars on a chronological axis.
*   **Dependency Tracking:** Visual lines connecting tasks show prerequisites.
*   **Detail on Demand:** Clicking any specific task bar opens a modal with comprehensive details.

### 🤖 AI-Powered Task Assistant
*   **Smart Task Decomposition:** AI analyzes complex tasks to suggest sub-tasks.
*   **Workload Optimization:** Suggestions on task duration and resource allocation.

## 📂 Project Structure

```
src/
├── components/       # Reusable UI components
├── constants/        # Static constants and configuration
├── styles/           # Global and component-specific styles
├── utils/            # Helper functions
├── App.js            # Main application logic
└── index.js          # Entry point
```

## 🛠️ Technical Setup

### Dependencies
*   **React:** v19.1.0
*   **Tailwind CSS:** v3.4.17
*   **HTTP Proxy Middleware:** v3.0.5 (For routing)

### Development
To run this module in standalone mode for development:

```bash
npm install
npm start
```

The app will run on `http://localhost:3000`.
