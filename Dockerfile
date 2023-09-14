# Use the official Node.js image as the base image
FROM node:18

# Set the working directory in the container
WORKDIR /app

# Change the COPY command to only copy package.json and package-lock.json 
COPY package.json package-lock.json /app/

# Install the application dependencies
RUN npm install

# Copy the remaining application files into the working directory
COPY . /app/

EXPOSE 5000

# Define the entry point for the container
CMD ["npm", "start"]