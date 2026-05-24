// Solution: resilient-fetcher.ts
// Run with: npx tsx exercises/solutions/resilient-fetcher.ts

const fetchUrl = async (url: string): Promise<string> => {
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`)
  }

  return await response.text()
}

const fetchMultipleUrls = async (
  urls: string[],
): Promise<{ successes: string[]; failures: string[] }> => {
  const successes: string[] = []
  const failures: string[] = []

  for (let index = 0; index < urls.length; index++) {
    const url = urls[index]

    try {
      const content = await fetchUrl(url)
      successes.push(`${url} (${content.length} chars)`)
    } catch (caughtError: unknown) {
      if (caughtError instanceof Error) {
        failures.push(`${url}: ${caughtError.message}`)
      } else {
        failures.push(`${url}: Unknown error`)
      }
    }
  }

  return { successes, failures }
}

// Run
async function main(): Promise<void> {
  const testUrls = [
    "https://example.com",
    "https://httpbin.org/status/404",
    "https://this-domain-does-not-exist-12345.com",
    "https://example.com",
  ]

  const result = await fetchMultipleUrls(testUrls)

  console.log("✅ Successes:")
  for (let index = 0; index < result.successes.length; index++) {
    console.log(`  ${result.successes[index]}`)
  }

  console.log("\n❌ Failures:")
  for (let index = 0; index < result.failures.length; index++) {
    console.log(`  ${result.failures[index]}`)
  }
}

main()
