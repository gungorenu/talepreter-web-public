# Create image based off of the official Node 10 image
FROM node:23-alpine as builder

# Copy dependency definitions
COPY package.json package-lock.json ./

## installing and Storing node modules on a separate layer will prevent unnecessary npm installs at each build
## --legacy-peer-deps as ngx-bootstrap still depends on Angular 14
RUN npm install --legacy-peer-deps && mkdir /app && mv ./node_modules ./app

# Change directory so that our commands run inside this new directory
WORKDIR /app

# Get all the code needed to run the app
COPY . /app/

## Change apiEndpoint in environment.ts
RUN sh -c "sed -i 's|production: false|production: true|' src/environments/environment.ts"

# Build server side bundles
RUN npm run build

FROM node:23-alpine
## From 'builder' copy published folder
COPY --from=builder /app /app

WORKDIR /app
# Expose the port the app runs in
EXPOSE 19401

USER node

CMD ["node", "dist/talepreter-web/server/server.mjs"]
