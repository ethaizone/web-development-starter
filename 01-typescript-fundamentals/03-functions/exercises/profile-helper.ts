// Exercise: Build a profile helper
// Run with: npx tsx exercises/profile-helper.ts
//
// TODO: Write the following functions:
//
// 1. `getInitials(name: string): string`
//    Takes a full name like "Alice Smith" and returns "A.S."
//    Hint: use .split(" ") and index into the parts
//
// 2. `maskEmail(email: string, visibleCount: number = 2): string`
//    Takes "alice@example.com" and returns "al***@example.com"
//    Default visibleCount is 2 characters before the mask
//    Hint: use .split("@") to separate user from domain
//
// 3. `formatBio(text: string, maxLength: number = 100): string`
//    If text is longer than maxLength, truncate it and add "..."
//    If text fits, return it as-is
//
// Call each function with test data and print the results.
