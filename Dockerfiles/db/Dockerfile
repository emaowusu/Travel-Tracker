FROM postgres:17.4

LABEL "Project"="Travel-Tracker"
LABEL "Author"="Emmanuel Owusu-Addai"

ADD db_backup.sql docker-entrypoint-initdb.d/db_backup.sql
