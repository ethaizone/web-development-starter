# Module 01 — How the Web Works

## What you'll learn

A mental model of what happens when you type a URL and press Enter — from DNS
lookup to rendered page.

## Key Concepts

### Client and Server

Every web interaction has two sides:

| Role       | What it does                            | Example                                                |
| ---------- | --------------------------------------- | ------------------------------------------------------ |
| **Client** | Sends requests, displays responses      | Your browser (Chrome, Firefox, Safari)                 |
| **Server** | Receives requests, sends back responses | A computer running code that listens for HTTP requests |

Your browser is a **client** — it asks for things. A **server** is a program
running on a machine somewhere that answers.

When you visit `https://example.com`, your browser sends an **HTTP request** to
a server. The server processes it and sends back an **HTTP response**.

### HTTP: The Language of the Web

HTTP (HyperText Transfer Protocol) is the set of rules for how clients and
servers communicate.

**An HTTP request contains:**

- **Method** — what kind of action (GET, POST, PUT, DELETE)
- **URL** — the address being requested
- **Headers** — metadata (e.g., what formats the client accepts)
- **Body** — optional data (e.g., form fields submitted with POST)

**An HTTP response contains:**

- **Status code** — a number indicating what happened
- **Headers** — metadata (e.g., content type, caching rules)
- **Body** — the actual content (HTML, JSON, an image, etc.)

### HTTP Methods

| Method   | Purpose           | Has body? | Typical use                                   |
| -------- | ----------------- | --------- | --------------------------------------------- |
| `GET`    | Retrieve data     | No        | Loading a webpage, fetching a user profile    |
| `POST`   | Create something  | Yes       | Submitting a registration form, adding a link |
| `PUT`    | Replace something | Yes       | Updating an entire profile                    |
| `PATCH`  | Partially update  | Yes       | Changing just the display name                |
| `DELETE` | Remove something  | No        | Deleting a link                               |

DevStack Bio will use all of these. For example:

- `GET /alice` → show Alice's public profile
- `POST /api/links` → add a new link to your profile
- `DELETE /api/links/123` → remove a link

### HTTP Status Codes

| Range | Meaning      | Common codes you'll see                                |
| ----- | ------------ | ------------------------------------------------------ |
| 2xx   | Success      | `200 OK`, `201 Created`                                |
| 3xx   | Redirect     | `301 Moved Permanently`, `302 Found`                   |
| 4xx   | Client error | `400 Bad Request`, `401 Unauthorized`, `404 Not Found` |
| 5xx   | Server error | `500 Internal Server Error`                            |

### DNS: The Internet's Phone Book

When you type `https://devstack.bio`, your browser doesn't know where that
server is. It asks a **DNS resolver** to translate the domain name into an IP
address (like `203.0.113.42`).

```
You type a URL
    → Browser asks DNS: "Where is devstack.bio?"
    → DNS responds: "It's at 203.0.113.42"
    → Browser connects to 203.0.113.42
    → Sends HTTP request
    → Receives HTTP response
    → Renders the page
```

You won't configure DNS in this course — hosting platforms handle it for you.
But understanding it removes the mystery of how a name becomes a connection.

### What Gets Sent Back: Content Types

The `Content-Type` header tells the client what format the response body is in:

| Content-Type             | What it is      | When you'll use it                       |
| ------------------------ | --------------- | ---------------------------------------- |
| `text/html`              | A webpage       | When the server renders a page (SSR)     |
| `application/json`       | Structured data | When JavaScript fetches data from an API |
| `text/css`               | Stylesheet      | Your Tailwind-generated CSS file         |
| `application/javascript` | Code            | Your React app's JavaScript bundle       |

### How a Webpage Loads (Simplified)

```
1. Browser sends GET request to the server
2. Server returns HTML (text/html)
3. Browser starts parsing HTML
4. HTML references CSS → browser requests CSS files
5. HTML references JS → browser requests JavaScript files
6. Browser applies styles, executes JavaScript
7. Page is fully loaded and interactive
```

This is why we put `<link>` tags in `<head>` (for CSS) and `<script>` tags at
the end of `<body>` (for JS) — the order matters for performance.

### Client-Side Rendering (CSR) vs Server-Side Rendering (SSR)

|                           | CSR                                    | SSR                                     |
| ------------------------- | -------------------------------------- | --------------------------------------- |
| **Where HTML is built**   | In the browser, by JavaScript          | On the server, before sending           |
| **First request returns** | Minimal HTML + a big JS bundle         | Complete HTML                           |
| **Good for**              | Interactive apps (dashboards, editors) | Public pages (SEO, fast first paint)    |
| **DevStack Bio example**  | The dashboard where you edit links     | The public profile page at `/$username` |

TanStack Start supports **both**. You'll use SSR for public profile pages and
CSR for the interactive dashboard — this is a key architectural decision we'll
revisit in Module 12 and Module 13.

### What is an API?

An API (Application Programming Interface) is a set of rules for how software
components communicate. In web development, "API" usually means a **web API** —
a server endpoint that returns data (often JSON) instead of HTML.

```
Browser → GET /api/links → Server → JSON response → Browser processes data
Browser → GET /alice     → Server → HTML response  → Browser renders page
```

In TanStack Start, you'll use **server functions** instead of building a
separate API. They achieve the same goal — your client code calls a function,
and it runs on the server — but with type safety and no manual endpoint setup.
(More in Module 10.)

### Full Picture: What Happens When You Visit a DevStack Bio Profile

```
1. You type devstack.bio/alice in your browser
2. DNS resolves devstack.bio → server IP address
3. Browser sends: GET /alice (HTTP request)
4. Server receives the request
5. Server queries the database for username "alice"
6. Server renders the profile HTML (SSR)
7. Server sends back: 200 OK, HTML response
8. Browser receives HTML, parses it
9. Browser requests CSS and JS files referenced in the HTML
10. Browser renders the page
11. User sees Alice's profile
```

## Common Patterns

| Pattern                | Description                                                            | You'll use it in     |
| ---------------------- | ---------------------------------------------------------------------- | -------------------- |
| Request → Response     | The fundamental cycle                                                  | Every module         |
| Form submission (POST) | Client sends data, server processes it                                 | Module 07, 11        |
| Fetch data (GET)       | Client asks for data, server returns JSON                              | Module 10            |
| Redirect (3xx)         | Server tells browser to go somewhere else                              | Module 11 (auth)     |
| Cookie                 | Small piece of data the server asks the browser to store and send back | Module 11 (sessions) |

## Commands You'll Use

There are no commands in this module — it's all concepts. Starting from Module
02, you'll be running commands to set up your project.

## Deep Dive

- [MDN — How the Web Works](https://developer.mozilla.org/en-US/docs/Learn_web_development/Getting_started/Web_standards/How_the_web_works)
- [MDN — An Overview of HTTP](https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview)
- [MDN — HTTP Request Methods](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods)
- [MDN — HTTP Status Codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status)
- [MDN — MIME Types (Content-Type)](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types)
- [MDN — DNS](https://developer.mozilla.org/en-US/docs/Glossary/DNS)

---

**Next:** [Module 02 — Your First Server](../02-your-first-server/) → Set up
TanStack Start and see your first page render.
