# 06 — CI/CD Awareness

## The short version

**CI/CD** stands for **Continuous Integration / Continuous Delivery (or Deployment)**. It means: when you push code, things happen automatically — tests run, builds happen, and (optionally) your app gets deployed. You don't do these steps manually.

## What CI/CD means

### Continuous Integration (CI)

Every time you push code (or open a pull request):

1. A server **checks out your code**
2. **Installs dependencies**
3. **Runs your tests**
4. **Reports pass/fail**

If tests fail, the team knows immediately — before the broken code reaches production.

### Continuous Delivery (CD)

After CI passes:

1. **Build** the production bundle
2. Run any additional checks (linting, security scanning)
3. Package the app (e.g., Docker image)
4. Make it **ready to deploy** (delivery) or **deploy automatically** (deployment)

## How it works in practice

You define a **workflow file** in your repository. When a specific **event** occurs (push, pull request, tag), the workflow runs.

Example: a GitHub Actions workflow for a Node.js project

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 24
      - run: npm ci
      - run: npm test
```

Every push to `main` or any PR targeting `main` now runs tests automatically on a clean Ubuntu machine.

## Key terms

| Term | What it means |
|------|-------------|
| **Workflow** | The entire automated process, defined in a YAML file |
| **Event** | What triggers a workflow (push, PR, schedule, manual) |
| **Job** | A set of steps that run on the same machine |
| **Step** | One action: run a script, install a dependency, etc. |
| **Runner** | The server that executes your workflow (GitHub provides these) |
| **Action** | A reusable piece of workflow (like an npm package for CI) |

## CI/CD tools

| Tool | Type | Best for |
|------|------|----------|
| **GitHub Actions** | Built into GitHub | Most open-source and team projects — start here |
| **GitLab CI** | Built into GitLab | Teams using GitLab |
| **CircleCI** | Standalone | Teams needing advanced features |
| **Jenkins** | Self-hosted | Enterprises with custom requirements |

**Start with GitHub Actions.** It's free for public repositories and included in private repos with generous free minutes.

## When you need CI/CD

| Stage | CI/CD? |
|-------|--------|
| Learning (Tracks 01–02) | **Not needed.** Run tests manually. |
| Personal project on GitHub | **Nice to have.** Set up a basic CI workflow for practice. |
| Team project | **Essential.** Prevents broken code from reaching teammates. |
| Production app | **Essential.** Automated deploys reduce human error. |

## Deep dive

- [Understanding GitHub Actions](https://docs.github.com/en/actions/about-github-actions/understanding-github-actions) — official overview
- [GitHub Actions Quickstart](https://docs.github.com/en/actions/writing-workflows/quickstart) — write your first workflow
- [GitHub Actions Marketplace](https://github.com/marketplace?type=actions) — find reusable actions
- [CI/CD Concepts](https://www.redhat.com/en/topics/devops/what-cicd-pipeline) — Red Hat's explanation of the pipeline concept

---

**Next:** [Deployment Options](./07-deployment-options.md) → Put your app on the internet.
