# Step 1: Use an official Node.js image to build your app
FROM node:22-alpine AS builder

# RUN apk add --no-cache libc6-compat

# Set the working directory inside the container to /src.
# We need to set the working directory so Docker knows where to run the commands.
WORKDIR /src

# Step 3: Copy only package files and install dependencies
# This command is necessary for Docker to install project dependencies.
COPY package*.json ./
# npm ci installs exactly what's listed in your package-lock.json
# for consistent, repeatable builds.
RUN npm ci

# Install project dependencies using pnpm.
# RUN npm install

# Step 4: Copy the rest of your code and build the Next.js app
# Copy all files from the context directory
# (where the Dockerfile is located) to the working directory in the container.
COPY . .

# Run the project build command using pnpm.
RUN npm run build

# Step 5: Use a new, smaller Node.js image for the final app
# Define a second stage of the image based on node:22-alpine and name it as runner.
FROM node:22-alpine AS runner

# Set the working directory inside the container to /app.
WORKDIR /src

# Globally install the package manager pnpm.
# RUN npm i -g npm


# Step 6: Copy the built app from the builder stage

# Copy the node_modules folder from the base stage to the node_modules directory in the release stage.
# COPY --from=builder /src/node_modules ./node_modules
# Copy the package.json file from the base stage to the current directory in the release stage.
# COPY --from=builder /src/package.json ./package.json
# Copy the .next folder from the base stage to the .next directory in the release stage.
# COPY --from=builder /src/.next ./.next    

COPY --from=builder /src/.next/standalone ./
COPY --from=builder /src/public ./public
COPY --from=builder /src/.next/static ./.next/static

# Step 7: Expose the port your app will run on
EXPOSE 3000

# Step 8: Start the app using the standalone server
CMD ["node", "server.js", "--hostname", "0.0.0.0"]

# Define the default command to be executed when the container is started with pnpm start.
# CMD [ "npm", "start" ]
