FROM nginx:alpine

LABEL org.opencontainers.image.title="Travel-Tracker"
LABEL org.opencontainers.image.authors="Owusu"
LABEL org.opencontainers.image.description="Nginx reverse proxy for Travel-Tracker"

# Remove default config
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom config
COPY nginx.conf /etc/nginx/conf.d/trackerapp.conf

EXPOSE 80

