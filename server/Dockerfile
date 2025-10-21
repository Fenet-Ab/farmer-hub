# Use official Node.js image
FROM node:18

# Set working directory inside container
WORKDIR /app

# Copy package files first (better caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the project files
COPY . .

# Expose backend port
EXPOSE 5000

# Run the backend
CMD ["npm", "run", "dev"]
