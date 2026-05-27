# 05 — Docker Concepts

## The short version

**Docker** packages your application and all its dependencies into a
standardized unit called a **container**. A container runs the same way on your
laptop, your coworker's laptop, and the production server. No more "it works on
my machine."

## Why Docker matters

Without Docker:

- Your app works locally but breaks in production (different Node.js version,
  missing system library, different OS)
- Setting up a new developer's environment takes hours
- Deploying means manually installing dependencies on a server

With Docker:

- You define your environment in a `Dockerfile` — a text file that describes how
  to build your app's image
- The same container runs identically everywhere
- New developers run one command to get the full environment
- Deployment is pushing a container image

## Key concepts

### Images vs Containers

| Concept       | Analogy       | What it is                                                                    |
| ------------- | ------------- | ----------------------------------------------------------------------------- |
| **Image**     | A recipe      | A read-only template with your app + dependencies. Built from a `Dockerfile`. |
| **Container** | A cooked meal | A running instance of an image. Lightweight, isolated, ephemeral.             |

### Dockerfile

A text file that describes how to build an image:

```dockerfile
FROM node:24-slim

WORKDIR /app

COPY package*.json ./
RUN npm ci --production

COPY . .

CMD ["node", "server.js"]
```

Each instruction creates a **layer**. Only changed layers are rebuilt — that's
why Docker images are fast to update.

### Docker Compose

A YAML file that defines multi-container applications:

```yaml
services:
  app:
    build: .
    ports:
      - "3000:3000"
  db:
    image: postgres:16
    environment:
      POSTGRES_PASSWORD: secret
```

One command (`docker compose up`) starts both the app and the database.

### Registries

- **Docker Hub** — the default public registry (like npm for Docker images)
- **GitHub Container Registry (ghcr.io)** — free for public images, integrated
  with GitHub
- **Cloud provider registries** — AWS ECR, Google Artifact Registry, etc.

## When you'll use Docker

| Scenario               | How Docker helps                                                |
| ---------------------- | --------------------------------------------------------------- |
| Deploy DevStack Bio    | Build an image, push to a registry, deploy anywhere             |
| Run a database locally | `docker run postgres:16` — no install, no config                |
| CI/CD                  | Run tests in a clean container every time                       |
| Microservices          | Each service in its own container, communicating over a network |

## Do you need Docker right now?

**Not yet.** For learning (Tracks 01–02), running `tsx` and `npm` directly is
simpler. Docker becomes valuable when you:

- Need to deploy to a server
- Work with databases or services you don't want to install locally
- Join a team with a Docker-based setup
- Set up CI/CD pipelines

## Common commands

| Command                         | Purpose                                      |
| ------------------------------- | -------------------------------------------- |
| `docker build -t myapp .`       | Build an image from a Dockerfile             |
| `docker run -p 3000:3000 myapp` | Run a container, map port 3000               |
| `docker ps`                     | List running containers                      |
| `docker stop <container_id>`    | Stop a running container                     |
| `docker compose up`             | Start all services defined in `compose.yaml` |
| `docker compose down`           | Stop and remove all containers               |

## Deep dive

- [Docker Overview](https://docs.docker.com/get-started/docker-overview/) —
  official introduction
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) — install
  Docker on Mac/Windows
- [Docker Getting Started Guide](https://docs.docker.com/get-started/) —
  hands-on tutorial
- [Compose specification](https://docs.docker.com/compose/) — multi-container
  apps
- [Node.js Docker Best Practices](https://github.com/nodejs/docker-node/blob/main/docs/BestPractices.md)
  — official Node.js Docker image guide

---

**Next:** [CI/CD Awareness](./06-cicd-awareness.md) → Automate your workflow.
