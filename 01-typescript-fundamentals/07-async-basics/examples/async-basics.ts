// async-basics.ts — Run with: npx tsx examples/async-basics.ts

// Basic async function — fetch data from GitHub API
async function fetchGitHubUser(username: string): Promise<void> {
  const response = await fetch(`https://api.github.com/users/${username}`)
  const userData = await response.json()

  console.log(`User: ${userData.login}`)
  console.log(`Name: ${userData.name ?? "Not set"}`)
  console.log(`Public repos: ${userData.public_repos}`)
  console.log(`Followers: ${userData.followers}`)
}

// Returning data from async function
async function getGitHubUser(username: string): Promise<{ login: string; public_repos: number }> {
  const response = await fetch(`https://api.github.com/users/${username}`)
  const userData = await response.json()
  return {
    login: userData.login,
    public_repos: userData.public_repos,
  }
}

// Using the returned data
async function compareUsers(): Promise<void> {
  const firstUser = await getGitHubUser("octocat")
  const secondUser = await getGitHubUser("torvalds")

  console.log(`\n${firstUser.login}: ${firstUser.public_repos} repos`)
  console.log(`${secondUser.login}: ${secondUser.public_repos} repos`)
}

// Promise.all — run in parallel
async function fetchUsersInParallel(): Promise<void> {
  const [firstResponse, secondResponse] = await Promise.all([
    fetch("https://api.github.com/users/octocat"),
    fetch("https://api.github.com/users/torvalds"),
  ])

  const firstUserData = await firstResponse.json()
  const secondUserData = await secondResponse.json()

  console.log(`\nFetched in parallel:`)
  console.log(`  ${firstUserData.login} — ${firstUserData.followers} followers`)
  console.log(`  ${secondUserData.login} — ${secondUserData.followers} followers`)
}

// Run the examples
async function main(): Promise<void> {
  console.log("=== Fetch single user ===")
  await fetchGitHubUser("octocat")

  console.log("\n=== Compare users (sequential) ===")
  await compareUsers()

  console.log("\n=== Fetch in parallel ===")
  await fetchUsersInParallel()
}

main()
