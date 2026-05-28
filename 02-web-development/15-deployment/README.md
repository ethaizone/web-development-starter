# Module 15 — Deployment

## What you'll learn

Build DevStack Bio for production and deploy it to the internet.

## Key Concepts

### Building for Production

The dev server (`npm run dev`) is not suitable for production. Build an
optimized version:

```bash
npm run build
```

This creates an optimized bundle:

- Minified JavaScript and CSS
- Tree-shaking removes unused code
- Code splitting loads only what each route needs

Test the production build locally:

```bash
npm run start
```

### Deployment Options

| Platform                        | Pros                                               | Cons                    | Cost                |
| ------------------------------- | -------------------------------------------------- | ----------------------- | ------------------- |
| **Vercel**                      | Easiest setup, auto-deploys from Git, free tier    | Vendor lock-in          | Free → $20/mo       |
| **Railway**                     | Simple, supports SQLite (persistent disk), good DX | Less generous free tier | Free → $5/mo        |
| **Fly.io**                      | Full control, Docker-based, global deployment      | More setup required     | Free tier available |
| **VPS (DigitalOcean, Hetzner)** | Full control, cheapest at scale                    | You manage everything   | $4–5/mo             |

For DevStack Bio (SQLite), you need a platform that supports **persistent file
storage** — the database file must survive redeployments. Vercel's serverless
functions don't support this. **Railway** or **Fly.io** are better fits.

### Environment Variables

In production, set these environment variables on your hosting platform:

| Variable         | Purpose                                              |
| ---------------- | ---------------------------------------------------- |
| `SESSION_SECRET` | A random 32+ character string for session encryption |
| `NODE_ENV`       | `production`                                         |

Never commit `.env` files to Git. Always use the hosting platform's environment
variable settings.

### Pre-Deployment Checklist

Before deploying:

- [ ] `npm run build` succeeds without errors
- [ ] `npm run start` works locally
- [ ] All features work in the production build (not just dev)
- [ ] `.env` is in `.gitignore`
- [ ] `.gitignore` excludes `devstack.db`, `node_modules/`, `.env`
- [ ] `SESSION_SECRET` is a strong, random value (not the dev fallback)
- [ ] No `console.log` statements in production code (optional but good
      practice)

## Commands You'll Use

| Command                     | Purpose                            |
| --------------------------- | ---------------------------------- |
| `npm run build`             | Build optimized production bundle  |
| `npm run start`             | Serve the production build locally |
| `git remote add origin URL` | Connect local repo to GitHub       |
| `git push origin main`      | Push commits to GitHub             |

## Common Patterns

| Pattern                                     | When                           |
| ------------------------------------------- | ------------------------------ |
| `.env.example` committed, `.env` gitignored | Every project with secrets     |
| `SESSION_SECRET` from env, not hardcoded    | Security                       |
| Persistent volume for SQLite                | Prevents data loss on redeploy |
| Test `npm run build` before deploying       | Catches build errors early     |
| Descriptive commit messages                 | Git history is documentation   |

## What We Built: Deployment

### Step 1: Final `.gitignore` check

We made sure `.gitignore` included:

```
node_modules
devstack.db
devstack.db-wal
devstack.db-shm
.env
.output/
```

> **Note:** The `drizzle/` folder contains migration SQL files. These should be
> committed to version control, so do **not** add `drizzle/` to `.gitignore`.

### Step 2: Built for production

```bash
npm run build
```

If the build had failed, common fixes would be:

- TypeScript errors → check types and imports
- Missing dependencies → run `npm install`
- Route tree out of date → restart the dev server and try again

### Step 3: Tested the production build

```bash
npm run start
```

We visited `http://localhost:3000` and tested:

- Registration and login
- Dashboard profile editing and link management
- Public profile page
- 404 for nonexistent profiles

### Step 4: Created a GitHub repository

```bash
# Initialize remote (if you haven't already)
git remote add origin https://github.com/YOUR_USERNAME/devstack-bio.git
git branch -M main
git push -u origin main
```

### Step 5: Deployed

We picked a platform and followed their official guide:

| Platform    | Guide                                                                                            | Notes                                                |
| ----------- | ------------------------------------------------------------------------------------------------ | ---------------------------------------------------- |
| **Railway** | [docs.railway.app](https://docs.railway.app)                                                     | Recommended for SQLite — supports persistent volumes |
| **Fly.io**  | [fly.io/docs](https://fly.io/docs/)                                                              | Docker-based, global deployment, free tier           |
| **VPS**     | [TanStack Start — Hosting](https://tanstack.com/start/latest/docs/framework/react/guide/hosting) | Full control, cheapest at scale                      |

Key things to configure on any platform:

- **Persistent volume** — SQLite needs a file that survives redeployments
- **Environment variables** — `SESSION_SECRET` (random 32+ char string) and
  `NODE_ENV=production`
- **Build command** — `npm run build`
- **Start command** — `npm run start`

### Step 6: Created a `.env.example` file

We created `.env.example` (this IS committed — it tells other developers what
variables are needed):

```
# Required: A random 32+ character string for session encryption
# Generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
SESSION_SECRET=change-me-to-a-random-string

# Optional: Set to 'production' in deployed environments
NODE_ENV=development
```

### Step 7: Committed

```bash
git add .
git commit -m "Prepare for deployment: update .gitignore, add .env.example"
git push origin main
```

### Step 8: Verified deployment

We visited the deployed URL and tested the full flow:

1. Register a new account
2. Edit your profile and add links
3. View your public profile
4. Log out and back in

DevStack Bio is live on the internet! 🎉

## Deep Dive

- [TanStack Start — Hosting](https://tanstack.com/start/latest/docs/framework/react/guide/hosting)
- [Railway — Documentation](https://docs.railway.app)
- [Fly.io — Documentation](https://fly.io/docs/)
- [GitHub — Create a Repo](https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-new-repository)
- [Git — Documentation](https://git-scm.com/docs)

---

**Congratulations!** You've read through how a full-stack web application was
built and deployed. Here's what you can do next:

- Review the [Pro Guidelines](../../03-professional-guidelines/) for topics like
  Linux, Docker, and CI/CD
- Add features to DevStack Bio: OAuth login, custom themes, link click tracking
- Start your own project using the same stack
