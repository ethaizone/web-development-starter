# Module 07: Async Basics

## What you'll learn
Write code that waits for things — like fetching data from the internet.

## Key concepts

### Why async?

Some operations take time: reading a file, calling an API, querying a database. JavaScript is single-threaded — if it waited for each operation to finish, nothing else could run. Async lets your code start an operation, do other work, and come back when the result is ready.

### Promises — the foundation

A Promise is an object that represents a value you'll get later.

```ts
// A Promise has three states:
// - pending    → still waiting
// - fulfilled  → got the result
// - rejected   → something went wrong

// .then() — handle the result when it arrives
fetch("https://api.github.com/users/octocat")
  .then((response) => response.json())
  .then((data) => {
    console.log(data.login)   // "octocat"
  })
```

This is the old style. You'll see it in older code. Modern code uses `async/await`.

### `async/await` — the modern way

`await` pauses the function until the Promise resolves. The function must be marked `async`.

```ts
async function fetchGitHubUser(username: string): Promise<void> {
  const response = await fetch(`https://api.github.com/users/${username}`)
  const userData = await response.json()

  console.log(`${userData.login} — ${userData.public_repos} public repos`)
}

fetchGitHubUser("octocat")
```

Think of `await` as "wait here until this finishes, then give me the result."

### Return types of async functions

Async functions always return a `Promise`. TypeScript shows this in the return type:

```ts
// This function returns Promise<string>, not string
async function getUsername(): Promise<string> {
  const response = await fetch("https://api.github.com/users/octocat")
  const data = await response.json()
  return data.login
}
```

### Calling async functions from other async functions

```ts
async function getGitHubUser(username: string): Promise<{ login: string; public_repos: number }> {
  const response = await fetch(`https://api.github.com/users/${username}`)
  const userData = await response.json()
  return userData
}

async function printUserInfo(username: string): Promise<void> {
  const userInfo = await getGitHubUser(username)
  console.log(`${userInfo.login} has ${userInfo.public_repos} repos`)
}
```

### Multiple awaits in sequence

Each `await` waits for the previous one to finish. They run one after another.

```ts
async function fetchMultipleUsers(): Promise<void> {
  const firstUser = await fetchGitHubUser("octocat")
  const secondUser = await fetchGitHubUser("torvalds")
  // second fetch only starts after first completes
}
```

### `Promise.all` — run in parallel

When you have multiple independent async operations, run them at the same time.

```ts
async function fetchMultipleUsersParallel(): Promise<void> {
  const [firstResponse, secondResponse] = await Promise.all([
    fetch("https://api.github.com/users/octocat"),
    fetch("https://api.github.com/users/torvalds"),
  ])

  const firstUserData = await firstResponse.json()
  const secondUserData = await secondResponse.json()

  console.log(firstUserData.login)   // "octocat"
  console.log(secondUserData.login)  // "torvalds"
}
```

⚠️ Error handling with `Promise.all`: if ANY promise rejects, the whole thing rejects. We'll cover error handling in Module 08.

### Running async code at the top level

You can't use `await` at the top level of a file with the default `tsx` setup. Wrap your code in an `async` function and call it:

```ts
async function main(): Promise<void> {
  const data = await fetchGitHubUser("octocat")
}

main()
```

You'll see this pattern in all the examples for this module.

## Commands you'll use

| Command | Purpose |
|---------|---------|
| `npx tsx file.ts` | Run a TypeScript file |

## Common patterns

| Pattern | When to use |
|---------|------------|
| `async/await` | Default choice for async code |
| `Promise.all` | Multiple independent async operations |
| `Promise<T>` return type | Annotating async function return types |
| Sequential `await` | When each call depends on the previous result |

## Now build it

Create `async-basics.ts` and write:

1. An async function `fetchGitHubRepos(username: string)` that fetches `https://api.github.com/users/${username}/repos` and returns the JSON response
2. An async function `printTopRepos(username: string, count: number)` that calls `fetchGitHubRepos`, then prints the top `count` repos by star count (use `repo.stargazers_count`)
3. Wrap your calls in an `async function main()` and call `main()` at the bottom

Note: If you get rate-limited by GitHub API, you'll see an error. We'll handle errors properly in Module 08.

---
📖 **Deep dive:**
- [TypeScript Handbook — Everyday Types (Functions Returning Promises)](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#functions-which-return-promises)
- [MDN — async function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function)
- [MDN — Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
