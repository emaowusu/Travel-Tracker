FROM node:22-alpine3.20 AS build

# INSTALL git AND bash
RUN apk add --no-cache git bash

WORKDIR /app

COPY package*.json ./

# INSTALL only PRODUCTION DEPENDENCIES
RUN npm ci --omit=dev

# COPY SOURCE FILES
COPY . .

# RUN npm RUN build
FROM node:22-alpine3.20

# INSTALL git
RUN apk add --no-cache git bash

# CREATE NON-ROOT USER
RUN addgroup -S nodejs && adduser -S nodejs -G nodejs


WORKDIR /app

# COPY FILES FROM BUILD STAGE
COPY --from=build /app /app


# ADD PERMISSION WHILE COPYING THE FILE

COPY --chmod=0755 docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh

# SWITCH TO NON-ROOT USER
USER nodejs

EXPOSE 3000

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["node", "server.js"]

