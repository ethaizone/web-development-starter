// Exercise: Build an ID generator for DevStack Bio
// Run with: npx tsx exercises/id-generator.ts
// Prerequisite: Run `npm install nanoid` in this folder first
//
// TODO: Create this from scratch:
//
// 1. Create a folder structure:
//    exercises/
//    ├── package.json        ← npm init -y
//    ├── .gitignore          ← add node_modules/
//    └── src/
//        └── main.ts         ← your code
//
// 2. Install nanoid: npm install nanoid
// 3. Install tsx as dev dependency: npm install --save-dev tsx
//
// 4. In src/main.ts:
//    - Import nanoid
//    - Define a type `ProfileLink` with id, title, url, order
//    - Write a function `createLink(title: string, url: string, order: number): ProfileLink`
//      that generates a nanoid(10) for the id
//    - Create an array of 3 links using this function
//    - Print each link
//
// 5. Add script to package.json: "dev": "tsx src/main.ts"
// 6. Run: npm run dev
