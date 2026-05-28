# 06 — CI/CD Awareness

## The short version

**CI/CD** stands for **Continuous Integration / Continuous Delivery (or
Deployment)**. It means: when you push code, things happen automatically — tests
run, builds happen, and (optionally) your app gets deployed. You don't do these
steps manually.

## What CI/CD means

**Continuous Integration (CI)** — Every time you push code (or open a pull request), a server checks out your code, installs dependencies, runs your tests, and reports pass/fail. If tests fail, the team knows immediately — before broken code reaches production.

**Continuous Delivery (CD)** — After CI passes, the production bundle is built, additional checks run (linting, security scanning), the app is packaged, and it's either made ready to deploy (delivery) or deployed automatically (deployment).

## Key concepts

| Term         | What it means                                                  |
| ------------ | -------------------------------------------------------------- |
| **Workflow** | The entire automated process, defined in a YAML file           |
| **Event**    | What triggers a workflow (push, PR, schedule, manual)          |
| **Job**      | A set of steps that run on the same machine                    |
| **Step**     | One action: run a script, install a dependency, etc.           |
| **Runner**   | The server that executes your workflow (GitHub provides these) |
| **Action**   | A reusable piece of workflow (like an npm package for CI)      |

## CI/CD tools

| Tool               | Type              | Best for                                        |
| ------------------ | ----------------- | ----------------------------------------------- |
| **GitHub Actions** | Built into GitHub | Most open-source and team projects — start here |
| **GitLab CI**      | Built into GitLab | Teams using GitLab                              |
| **CircleCI**       | Standalone        | Teams needing advanced features                 |
| **Jenkins**        | Self-hosted       | Enterprises with custom requirements            |

**Start with GitHub Actions.** It's free for public repositories and included in
private repos with generous free minutes.

## When you need CI/CD

| Stage                      | CI/CD?                                                       |
| -------------------------- | ------------------------------------------------------------ |
| Learning (Tracks 01–02)    | **Not needed.** Run tests manually.                          |
| Personal project on GitHub | **Nice to have.** Set up a basic CI workflow for practice.   |
| Team project               | **Essential.** Prevents broken code from reaching teammates. |
| Production app             | **Essential.** Automated deploys reduce human error.         |

## Deep dive

- [Understanding GitHub Actions](https://docs.github.com/en/actions/about-github-actions/understanding-github-actions)
  — official overview
- [GitHub Actions Quickstart](https://docs.github.com/en/actions/writing-workflows/quickstart)
  — write your first workflow
- [GitHub Actions Marketplace](https://github.com/marketplace?type=actions) —
  find reusable actions
- [CI/CD Concepts](https://www.redhat.com/en/topics/devops/what-cicd-pipeline) —
  Red Hat's explanation of the pipeline concept

---

**Next:** [Deployment Options](./07-deployment-options.md) → Put your app on the
internet.
