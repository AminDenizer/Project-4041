# 🚀 Unified Project Management System

![Docker](https://img.shields.io/badge/Docker-Containerized-blue?logo=docker)
![Nginx](https://img.shields.io/badge/Nginx-Reverse_Proxy-green?logo=nginx)
![Status](https://img.shields.io/badge/Status-Active-success)

## 📖 System Overview

This repository hosts a comprehensive, microservices-based Project Management System. The architecture allows for strict separation of concerns by dividing the application into three distinct services (Two Frontends and one Backend), all orchestrated via **Docker Compose**.

To ensure a seamless user experience and robust security, the system utilizes **Nginx** as a gateway. Users interact with the system solely through standard web ports (Port 80/443), while Nginx intelligently routes traffic to the appropriate internal containers.

---

## 🏗️ Architecture & Services

### 1. 📊 Gantt Chart Visualization (`/gantt-chart-project`)
*   **Role:** Visualization Frontend.
*   **Function:** Displays tasks on an interactive timeline. Features **AI integration** for smart task breakdown and analysis.
*   **Internal Container Name:** `frontend_gantt_container`
*   **Route:** `/Gant/`

### 2. 🖥️ Management Dashboard (`/project-management-dashboard`)
*   **Role:** Administration Frontend.
*   **Function:** The command center for Admins and Workers. Handles user creation, task assignment, file attachments, and role management.
*   **Internal Container Name:** `frontend_admin_container`
*   **Route:** `/` (Root)

### 3. ⚙️ Core Backend (`/my-backend`)
*   **Role:** API & Logic Layer.
*   **Function:** Node.js application connected to **MongoDB**. Includes **Swagger** documentation.
*   **Internal Container Name:** `backend_container`
*   **Route:** `/api/`

### 4. 🗄️ Database (`mongodb`)
*   **Role:** Persistent Storage.
*   **Image:** `mongo:latest`
*   **Port:** `2900:27017` (Exposed to host on 2900)
*   **Credentials:** Configured via environment variables.

---

## 🌐 Network Topology (Nginx Reverse Proxy)

The system uses an **Nginx Reverse Proxy** to manage traffic.

*   **Domain:** `bixco.ir`
*   **SSL:** Configured with Certbot (Let's Encrypt).
*   **Routing Rules:**
    *   `https://bixco.ir/` -> **Dashboard Frontend**
    *   `https://bixco.ir/Gant/` -> **Gantt Frontend**
    *   `https://bixco.ir/api/` -> **Backend API**

---

## 🚀 Getting Started

Since the project is fully containerized, you can spin up the entire environment with a single command.

### Prerequisites
*   Docker & Docker Compose installed on your machine.

### Installation
1.  Clone the repository.
2.  Navigate to the root directory.
3.  Run the orchestration command:

```bash
docker-compose up -d --build
```

The system will pull necessary images, build the custom containers, and start the Nginx proxy.

### 🔧 Configuration
*   **Nginx Config:** Located at `./nginx.conf`.
*   **SSL Certificates:** Stored in `./ssl` and `./certbot`.
