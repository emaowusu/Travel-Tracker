## STEPS TO BUILD THE APPLICATION 

**cd into the project directory**

### Create .env file in root directory and create the following environment variables

```bash
POSTGRES_USER=tracker_user
POSTGRES_PASSWORD=StrongPassword123!
POSTGRES_DB=world

SERVER_PORT=3000
APP_USERNAME=admin
APP_PASSWORD=secret123

DB_HOST=trackerdb
DB_PORT=5432
DB_USER=tracker_user
DB_PASSWORD=StrongPassword123!
DB_NAME=world
```

## BUILD AND RUN THE CONTAINER

```bash
docker compose build
```
```bash
docker compose up -d
```

### Or you can run both commands in a single line

```bash
docker compose --env-file .env up -d --build
```

### Access the application through

```bash
https://127.0.0.1:3000
```


## SOME TROUBLESHOOTING DOCKER COMMANDS

### Check container memory limit

```bash
docker inspect <container_id> --format='{{.HostConfig.Memory}}'
```

### Check logs 

```bash
docker logs <container_id>
```

# Access the container shell

```bash
docker exec -it <app_container> bash
```

## ACCESS THE DATABASE

```bash
psql -h db -U postgres -d world
```


# Delete the container and its volume and start all over

```bash
docker compose down -v
```

### Delete the all the images

***NOTE: IT WILL DELETE ALL THE DOCKER IMAGES RUNNING ON THE SYSTEM***

```bash
docker rmi $(docker images -aq) 
```


