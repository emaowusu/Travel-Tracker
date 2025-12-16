FROM node:22-alpine3.20 AS build

WORKDIR /app

# Install dependencies 
COPY package*.json ./
RUN npm ci --omit=dev

# Copy source code
COPY . .

# Runtime stage
FROM node:22-alpine3.20

# Create non-root user
RUN addgroup -S nodejs && adduser -S nodejs -G nodejs

WORKDIR /app

# Copy app from build stage
COPY --from=build /app /app

# Drop privileges
USER nodejs

EXPOSE 3000

CMD ["node", "server.js"]
