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

- You define your environment in a `Dockerfile` — a text file that describes
  how to build your app's image
- The same container runs identically everywhere
- New developers run one command to get the full environment
- Deployment is pushing a container image

## Key concepts

| Concept           | What it is                                                                    |
| ----------------- | ------------------------------------------------------------------------------ |
| **Image**         | A read-only template with your app + dependencies. Built from a `Dockerfile`. |
| **Container**     | A running instance of an image. Lightweight, isolated, ephemeral.             |
| **Dockerfile**    | Text file that describes how to build an image (recipe).                      |
| **Docker Compose**| Tool for defining multi-container applications (app + database, etc.).        |
| **Registry**      | Where images are stored and shared (Docker Hub, GitHub Container Registry).   |

## Do you need Docker right now?

**Not yet.** For learning (Tracks 01–02), running `tsx` and `npm` directly is
simpler. Docker becomes valuable when you:

- Need to deploy to a server
- Work with databases or services you don't want to install locally
- Join a team with a Docker-based setup
- Set up CI/CD pipelines

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
