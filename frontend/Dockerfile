# Use Node.js as the base image
FROM node:18

# Set working directory inside container
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json ./
RUN npm install

# Copy the rest of the frontend code
COPY . .

# Expose React default port
EXPOSE 3000

# Start the React app
CMD ["npm", "start"]
