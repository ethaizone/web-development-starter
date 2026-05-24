// Solution: link-validator.ts
// Run with: npx tsx exercises/solutions/link-validator.ts

const validateUrl = (url: string): string => {
  if (url.startsWith("https://")) {
    return "valid"
  } else if (url.startsWith("http://")) {
    return "valid"
  } else if (url === "") {
    return "empty"
  } else {
    return "invalid"
  }
}

const countValidLinks = (urls: string[]): number => {
  let validCount = 0

  for (let index = 0; index < urls.length; index++) {
    if (validateUrl(urls[index]) === "valid") {
      validCount = validCount + 1
    }
  }

  return validCount
}

const findFirstInvalidLink = (urls: string[]): number => {
  for (let index = 0; index < urls.length; index++) {
    const validationStatus = validateUrl(urls[index])
    if (validationStatus !== "valid") {
      return index
    }
  }

  return -1
}

// Tests
const testUrls = ["https://github.com", "ftp://bad.com", "", "https://example.com"]

console.log("Validations:")
for (let index = 0; index < testUrls.length; index++) {
  console.log(`  ${testUrls[index]} → ${validateUrl(testUrls[index])}`)
}

console.log(`Valid links count: ${countValidLinks(testUrls)}`)          // 2
console.log(`First invalid at index: ${findFirstInvalidLink(testUrls)}`) // 1

// All valid case
const goodUrls = ["https://a.com", "https://b.com"]
console.log(`All valid? Index: ${findFirstInvalidLink(goodUrls)}`)       // -1
