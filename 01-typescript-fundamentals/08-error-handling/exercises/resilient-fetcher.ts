// Exercise: Build a resilient link fetcher
// Run with: npx tsx exercises/resilient-fetcher.ts
//
// You're building a tool that fetches multiple URLs and reports
// which ones succeeded and which failed.
//
// TODO: Write these functions:
//
// 1. `fetchUrl(url: string): Promise<string>`
//    - Use fetch() to GET the url
//    - If response is NOT ok, throw Error with status code
//    - Return the response text (use .text(), not .json())
//
// 2. `fetchMultipleUrls(urls: string[]): Promise<{ successes: string[]; failures: string[] }>`
//    - Loop through urls
//    - For each url, try to fetchUrl it
//    - If it succeeds, add "url (length chars)" to successes
//    - If it fails, add "url: error message" to failures
//    - Return { successes, failures }
//
// 3. Test with these URLs:
//    - "https://example.com" (should succeed)
//    - "https://httpbin.org/status/404" (should fail with 404)
//    - "https://this-domain-does-not-exist-12345.com" (should fail with network error)
//    - "https://example.com" (should succeed)
//
// Print the successes and failures.
