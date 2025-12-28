#!/bin/bash

set -e

DB_USER="trackeruser"
DB_PASSWORD="StrongPassword123"
DB_NAME="world"

psql -U postgres <<EOF
DO \$\$
BEGIN
   IF NOT EXISTS (
      SELECT FROM pg_roles WHERE rolname = '$DB_USER'
   ) THEN
      CREATE USER $DB_USER WITH PASSWORD '$DB_PASSWORD';
   END IF;
END
\$\$;

GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;
EOF

psql -U postgres -tc "SELECT 1 FROM pg_database WHERE datname = '$DB_NAME'" \
| grep -q 1 || psql -U postgres -c "CREATE DATABASE $DB_NAME;"


