FROM postgres:17.4-alpine

LABEL org.opencontainers.image.title="Travel-Tracker"
LABEL org.opencontainers.image.authors="Owusu"
LABEL org.opencontainers.image.description="PostgreSQL database for Travel-Tracker"

# Copy init script (shell)
COPY ./init-db.sql /docker-entrypoint-initdb.d/
