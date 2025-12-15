FROM postgres:17.4-alpine

LABEL org.opencontainers.image.title="Travel-Tracker"
LABEL org.opencontainers.image.authors="Owusu"
LABEL org.opencontainers.image.description="PostgreSQL database for Travel-Tracker"

ADD db_backup.sql docker-entrypoint-initdb.d/db_backup.sql

RUN chmod 644 /docker-entrypoint-initdb.d/db_backup.sql
