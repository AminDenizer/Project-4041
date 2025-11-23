# Stage 1: Build Stage - Use Node.js 18-alpine for building the Node.js application
FROM node:18-alpine AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json files to leverage Docker's cache
COPY package.json ./
COPY package-lock.json ./

# Install project dependencies. --frozen-lockfile ensures reproducible builds.
RUN npm install --frozen-lockfile

# Copy the entire source code of the project to the working directory
COPY . .

# Stage 2: Run Stage - Use a lightweight Node.js image for running the application
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy installed dependencies and the entire application source from the 'builder' stage
# This ensures all your backend files (e.g., in src/, models/, controllers/) are present.
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app .

# Expose port 5000 for server access (ensure your Node.js app listens on this port)
EXPOSE 5000

# Default command to start the Node.js server when the container runs
# This command directly executes your server.js file using Node.
CMD ["node", "server.js"]