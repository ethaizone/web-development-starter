# 07 — Deployment Options

## The short version

You built an app locally. Now you want anyone on the internet to use it. **Deployment** means putting your app on a server that's always online. There are several approaches, each with different trade-offs.

## Three ways to deploy

### 1. Platform-as-a-Service (PaaS)

You push code, the platform builds and runs it. You don't manage servers.

| Platform | How it works | Good for |
|----------|-------------|----------|
| **Railway** | Push to Git → auto-deploy. Built-in database add-ons. | Getting started fast. Generous free tier. |
| **Fly.io** | Deploy from a Dockerfile. Runs containers close to users globally. | Apps needing low latency. |
| **Render** | Git push to deploy. Free static sites and web services. | Simple web apps and APIs. |
| **Vercel** | Optimized for Next.js and frontend frameworks. | Frontend-heavy apps. |

**Trade-offs:** Easiest to start. Less control over the server. Pricing scales with usage.

### 2. Virtual Private Server (VPS)

You rent a Linux VM and manage everything yourself.

| Provider | What you get |
|----------|-------------|
| **DigitalOcean Droplet** | Linux VM from $4/month. Great docs and community. |
| **Hetzner Cloud** | Cheap European VMs. Good value. |
| **AWS EC2** | Enterprise-grade. More complex setup. |
| **Linode (Akamai)** | Simple VPS with good documentation. |

**What you do yourself:** Install Node.js, configure a reverse proxy (Caddy or nginx), set up SSL, manage processes (systemd or PM2), keep the OS updated.

**Trade-offs:** Full control. More to learn. Cheaper at scale. You are the sysadmin.

### 3. Serverless / Edge

Your code runs in response to requests, billed per execution. No server to manage at all.

| Platform | How it works |
|----------|-------------|
| **Cloudflare Workers** | Run JavaScript at the edge (close to users). |
| **AWS Lambda** | Run functions in response to events. |
| **Netlify Functions** | Serverless functions attached to a static site. |

**Trade-offs:** Scales to zero when idle. Cold start latency. Limited runtime (not ideal for long-running servers). Best for APIs, not full-stack apps with persistent connections.

## What about TanStack Start?

TanStack Start apps are Node.js servers. The recommended approach:

1. **Easiest:** PaaS (Railway, Fly.io) — deploy your Node.js server directly
2. **Most control:** VPS — install Node.js, run the server behind a reverse proxy
3. **CI/CD:** Automate deploys with GitHub Actions → build → push to your platform

See the [TanStack Start hosting guide](https://tanstack.com/start/latest/docs/framework/react/hosting) for framework-specific deployment instructions.

## Key concepts for any deployment

| Concept | What it means |
|---------|-------------|
| **Domain** | Your app's address (e.g., `devstack.bio`). Buy from Namecheap, Cloudflare, etc. |
| **DNS** | Maps your domain to your server's IP address. Managed by your domain registrar or Cloudflare. |
| **SSL/TLS** | Encrypts traffic (`https://`). Free via [Let's Encrypt](https://letsencrypt.org/) or your platform's built-in TLS. |
| **Reverse proxy** | Sits in front of your Node.js app, handles SSL and routing. Caddy does this automatically; nginx needs manual config. |
| **Process manager** | Keeps your app running, restarts on crash. PM2 or systemd. |
| **Environment variables** | Secrets and config (database URL, API keys). Never hardcode — use `.env` files locally, platform settings in production. |

## Decision guide

```
First deployment? ──── Yes ──── Use Railway or Fly.io
                          │
                          No
                          │
           Need full server control? ──── Yes ──── VPS (DigitalOcean, Hetzner)
                          │
                          No
                          │
               Budget matters? ──── Yes ──── VPS (cheapest long-term)
                          │
                          No
                          │
                    Use what your team uses
```

## Deep dive

- [TanStack Start — Hosting](https://tanstack.com/start/latest/docs/framework/react/hosting) — framework-specific deployment guide
- [Railway Docs](https://docs.railway.com/) — deploy from Git
- [Fly.io Docs](https://fly.io/docs/) — deploy containers globally
- [DigitalOcean Node.js Sample App](https://docs.digitalocean.com/products/app-platform/getting-started/sample-apps/node/) — deploy Node.js on App Platform
- [Let's Encrypt](https://letsencrypt.org/) — free SSL certificates
- [Caddy Server](https://caddyserver.com/) — web server with automatic HTTPS
- [Cloudflare DNS](https://www.cloudflare.com/learning/dns/what-is-dns/) — understand DNS basics

---

**Next:** [Further Learning](./08-further-learning.md) → Where to go from here.
