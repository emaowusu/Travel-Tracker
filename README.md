
# Node.js + PostgreSQL Application  
## *Using Docker Compose, Kubernetes & Minikube*

## Architectural Diagram

![Application](./images/Architecture%20Diagram.png)

## 📌 Project Description

This project is a **production-ready Node.js application** backed by a **PostgreSQL database**, designed to run seamlessly in both **local Docker environments** and **Kubernetes clusters (Minikube)**.

The application is fully containerized using **Docker** and orchestrated locally with **Docker Compose**, enabling fast setup, consistent environments, and easy local development. Environment-specific configuration is handled securely using `.env` files, Kubernetes **ConfigMaps**, and **Secrets**.

For deployment, the project includes **Kubernetes manifests** that define deployments, services, ingress, persistent storage, and networking. It supports **scalable, cloud-native deployment patterns**, making it suitable for real-world production use cases and learning Kubernetes fundamentals.

Key features include:

* Containerized Node.js backend
* PostgreSQL database with persistent storage
* Secure environment variable management
* Kubernetes-native service discovery
* Ingress-based external access
* Minikube support for local Kubernetes testing
* Clean separation between development and production environments

This project serves as a **reference architecture** for building, containerizing, and deploying full-stack backend applications using modern DevOps and cloud-native tooling.


## 🧰 Tools & Technologies Used

### Application & Runtime

* **Node.js (v22)** – Backend runtime environment
* **Express.js** – Web framework for Node.js
* **PostgreSQL (v17)** – Relational database system



### Containerization

* **Docker** – Container runtime
* **Dockerfile** – Image build definition
* **Docker Compose** – Local multi-container orchestration



### Configuration & Secrets Management

* **.env files** – Local environment variable management
* **Kubernetes ConfigMaps** – Non-sensitive configuration
* **Kubernetes Secrets** – Secure storage of sensitive data



### Kubernetes & Orchestration

* **Kubernetes** – Container orchestration platform
* **Minikube** – Local Kubernetes cluster
* **kubectl** – Kubernetes command-line tool
* **Deployments** – Application lifecycle management
* **Services (ClusterIP / NodePort)** – Internal and external networking
* **Ingress (NGINX)** – HTTP routing and external access
* **Persistent Volumes (PV/PVC)** – Database storage
* **StorageClass** – Dynamic volume provisioning



### Networking & Access

* **Kubernetes DNS** – Service discovery
* **Ingress Controller (NGINX)** – External traffic management
* **Port Forwarding** – Local service access
* **Minikube Tunnel** – LoadBalancer simulation


### Database & Debugging Tools

* **psql** – PostgreSQL CLI client
* **kubectl exec** – Pod-level command execution
* **kubectl run** – Temporary debug pods



### DevOps & Utilities

* **OpenSSL** – Secure secret generation
* **Node.js Crypto Module** – Session secret generation
* **Git & GitHub** – Version control and collaboration



## STEPS TO BUILD THE APPLICATION 

**cd into the project directory**

### Create .env file in root directory and create the following environment variables

```bash
POSTGRES_USER=tracker_user
POSTGRES_PASSWORD=StrongPassword123
POSTGRES_DB=world

SERVER_PORT=3000
LOGIN_USERNAME=admin
LOGIN_PASSWORD=secret123

DATABASE_URL=postgres://postgres:StrongPassword123@127.0.0.1:5432/world
DB_HOST=trackerdb
DB_PORT=5432
DB_USER=tracker_user
DB_PASSWORD=StrongPassword123
DB_NAME=world
NODE_ENV=production
SESSION_SECRET=your_generated_secret_key
```


## You can use one of the following to generate the SESSION_SECRET

### Using OpenSSL CLI

```bash
openssl rand -hex 64
```

```bash
openssl rand -base64 32
```

### Using Node.js CLI

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'));"
```

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
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
http://127.0.0.1:3000
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

### Access the container shell

```bash
docker exec -it <container-ID> bash
```

### OR

```bash
docker exec -it <container-ID> sh
```


## ACCESS THE DATABASE

```bash
psql -U tracker_user -d world
```


## Delete the container and its volume and start all over

```bash
docker compose down -v
```

### Delete all Docker images

> ⚠️ **NOTE:** THIS WILL DELETE ALL DOCKER IMAGES ON THE SYSTEM

```bash
docker rmi $(docker images -aq)
```

### Verify environment variables inside the container

```bash
docker exec <container_id> env
```


### HOW TO RUN AND DEPLOY TO KUBERNETES CLUSTER (Minikube)


```bash
minikube addons enable ingress
```

```bash
minikube addons enable storage-provisioner
```

```bash
minikube addons enable default-storageclass
```

### Verify ingress

```bash
kubectl get pods -n ingress-nginx
```


## TO RUN THE K8s MANIFESTS

```bash
cd k8s
```

```bash
kubectl apply -f .
```


## Access the application through

```bash
minikube service nodejs-service --url
```

```bash
kubectl get svc
```

```bash
kubectl port-forward svc/tracker-service 3000:80
curl http://127.0.0.1:3000
```

### OR

```bash
minikube service nodejs-service
```

```bash
minikube tunnel
```

## Connect to POSTGRESQL SHELL

```bash
kubectl run -i --tty --rm debug \
--image=emacodes/trackerdb:v1.0.0 \
--env="PGHOST=trackerdb" \
--env="PGPORT=5432" \
--env="PGUSER=tracker_user" \
--env="PGPASSWORD=StrongPassword123" \
-- bash
```

```bash
kubectl run -i --tty --rm debug \
--image=emacodes/trackerdb:v1.0.0 \
--env="POSTGRES_HOST=trackerdb" \
--env="POSTGRES_PORT=5432" \
--env="POSTGRES_USER=tracker_user" \
--env="POSTGRES_PASSWORD=StrongPassword123" \
-- bash
```

```bash
psql -h trackerdb -U tracker_user -d world
```

```bash
psql -U tracker_user -d world
```


## Troubleshooting commands

```bash
kubectl get events --sort-by=.metadata.creationTimestamp
```

```bash
kubectl exec -it <pod-name> -- env | grep <envVariableName>
```


## Clean Up Kubernetes Resources

```bash
kubectl delete all,configmap,secret,pvc,ingress --all
```


## Local test if ingress is working

### Tunneling Minikube

```bash
minikube tunnel
```

```bash
curl -H "Host: your-dns-name" http://localhost
```

### External ingress test

```bash
http://your-dns-name
```

![Application](./images/img-1.png)
![Application](./images/img-2.png)
![Application](./images/img-3.png)


