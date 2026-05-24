// Exercise: Build a link validator
// Run with: npx tsx exercises/link-validator.ts
//
// You're building validation logic for the DevStack Bio link manager.
//
// TODO: Write the following functions:
//
// 1. `validateUrl(url: string): string`
//    - If url starts with "https://", return "valid"
//    - If url starts with "http://", return "valid"
//    - If url is empty string, return "empty"
//    - Otherwise, return "invalid"
//    Hint: use .startsWith()
//
// 2. `countValidLinks(urls: string[]): number`
//    - Loop through the array using a for loop
//    - Count how many URLs are "valid" (use your validateUrl function)
//    - Return the count
//
// 3. `findFirstInvalidLink(urls: string[]): number`
//    - Loop through the array using a for loop
//    - Return the index of the first URL that is NOT valid
//    - Return -1 if all links are valid
//
// Test with this data:
//    ["https://github.com", "ftp://bad.com", "", "https://example.com"]
