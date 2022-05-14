# Stage 1
# Create image based on the official Node 12 image from dockerhub
FROM node:12.18.4-alpine as node

# Create a directory where our app will be placed
RUN mkdir -p /usr/src/app

# Change directory so that our commands run inside this new directory
WORKDIR /usr/src/app

# Copy dependency definitions
COPY package*.json ./

# Install dependecies
RUN npm install

# Get all the code needed to run the app
COPY . .

# Run the angular in production mode
RUN npm run build

# Stage 2
FROM nginx:1.19.2-alpine

# Copy dist content to html nginx folder, config nginx to point in index.html
COPY --from=node /usr/src/app/dist/planning /usr/share/nginx/html

EXPOSE 80
