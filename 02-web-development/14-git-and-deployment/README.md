# Module 14 — Git & Deployment

## What you'll learn

Review your Git workflow, build the project for production, and deploy it to the internet.

## Key Concepts

### Git Review

By now you've been using Git throughout this project. Here's a quick review:

| Command                   | Purpose                              |
| ------------------------- | ------------------------------------ |
| `git init`                | Initialize a new repository          |
| `git status`              | See what files have changed          |
| `git add .`               | Stage all changes                    |
| `git add file.ts`         | Stage a specific file                |
| `git commit -m "message"` | Commit staged changes with a message |
| `git log --oneline`       | View commit history                  |
| `git diff`                | See unstaged changes                 |
| `git branch`              | List branches                        |
| `git checkout -b name`    | Create and switch to a new branch    |
| `git push origin main`    | Push commits to a remote repository  |

### Commit Messages

Use descriptive commit messages that explain **why**, not just what:

```
❌ "fix stuff"
❌ "updates"
✅ "Add password hashing with bcrypt for secure auth"
✅ "Fix profile page 404 when username contains uppercase"
```

### Building for Production

The dev server (`npm run dev`) is not suitable for production. Build an optimized version:

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

For DevStack Bio (SQLite), you need a platform that supports **persistent file storage** — the database file must survive redeployments. Vercel's serverless functions don't support this. **Railway** or **Fly.io** are better fits.

### Environment Variables

In production, set these environment variables on your hosting platform:

| Variable         | Purpose                                              |
| ---------------- | ---------------------------------------------------- |
| `SESSION_SECRET` | A random 32+ character string for session encryption |
| `NODE_ENV`       | `production`                                         |

Never commit `.env` files to Git. Always use the hosting platform's environment variable settings.

### Pre-Deployment Checklist

Before deploying:

- [ ] `npm run build` succeeds without errors
- [ ] `npm run start` works locally
- [ ] All features work in the production build (not just dev)
- [ ] `.env` is in `.gitignore`
- [ ] `.gitignore` excludes `devstack.db`, `node_modules/`, `.env`
- [ ] `SESSION_SECRET` is a strong, random value (not the dev fallback)
- [ ] No `console.log` statements in production code (optional but good practice)

## Now Build It: Deploy DevStack Bio

### Step 1: Final .gitignore check

Make sure your `.gitignore` includes:

```
node_modules
devstack.db
devstack.db-wal
devstack.db-shm
.env
.output/
```

> **Note:** The `drizzle/` folder contains migration SQL files. These should be committed to version control, so do **not** add `drizzle/` to `.gitignore`.

### Step 2: Build for production

```bash
npm run build
```

If the build fails, fix the errors before deploying. Common issues:

- TypeScript errors → check types and imports
- Missing dependencies → run `npm install`
- Route tree out of date → restart the dev server and try again

### Step 3: Test the production build

```bash
npm run start
```

Visit `http://localhost:3000` and test:

- Registration and login
- Dashboard profile editing and link management
- Public profile page
- 404 for nonexistent profiles

### Step 4: Create a GitHub repository

```bash
# Initialize remote (if you haven't already)
git remote add origin https://github.com/YOUR_USERNAME/devstack-bio.git
git branch -M main
git push -u origin main
```

### Step 5: Deploy

Pick a platform and follow their official guide:

| Platform    | Guide                                                                                            | Notes                                                |
| ----------- | ------------------------------------------------------------------------------------------------ | ---------------------------------------------------- |
| **Railway** | [docs.railway.app](https://docs.railway.app)                                                     | Recommended for SQLite — supports persistent volumes |
| **Fly.io**  | [fly.io/docs](https://fly.io/docs/)                                                              | Docker-based, global deployment, free tier           |
| **VPS**     | [TanStack Start — Hosting](https://tanstack.com/start/latest/docs/framework/react/guide/hosting) | Full control, cheapest at scale                      |

Key things to configure on any platform:

- **Persistent volume** — SQLite needs a file that survives redeployments
- **Environment variables** — `SESSION_SECRET` (random 32+ char string) and `NODE_ENV=production`
- **Build command** — `npm run build`
- **Start command** — `npm run start`

### Step 6: Create a `.env.example` file

Create `.env.example` (this IS committed — it tells other developers what variables are needed):

```
# Required: A random 32+ character string for session encryption
# Generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
SESSION_SECRET=change-me-to-a-random-string

# Optional: Set to 'production' in deployed environments
NODE_ENV=development
```

### Step 7: Final commit

```bash
git add .
git commit -m "Prepare for deployment: update .gitignore, add .env.example"
git push origin main
```

### Step 8: Verify deployment

Visit your deployed URL and test the full flow:

1. Register a new account
2. Edit your profile and add links
3. View your public profile
4. Log out and back in

Your app is live on the internet! 🎉

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

## Deep Dive

- [TanStack Start — Hosting](https://tanstack.com/start/latest/docs/framework/react/guide/hosting)
- [Railway — Documentation](https://docs.railway.app)
- [Fly.io — Documentation](https://fly.io/docs/)
- [GitHub — Create a Repo](https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-new-repository)
- [Git — Documentation](https://git-scm.com/docs)

---

**Congratulations!** You've built and deployed a full-stack web application. Here's what you can do next:

- Review the [Pro Guidelines](../../03-professional-guidelines/) for topics like Linux, Docker, and CI/CD
- Add features to DevStack Bio: OAuth login, custom themes, link click tracking
- Start your own project using the same stack
