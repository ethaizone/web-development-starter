# Module 05 — HTML & the DOM

## What you'll learn

Understand HTML elements, semantic markup, and how the browser turns your code
into an interactive page via the DOM.

## Key Concepts

### HTML Elements

Every web page is built from HTML elements. An element has:

```html
<tagname attribute="value">Content</tagname>
```

For example:

```html
<h1 class="title">Welcome to DevStack Bio</h1>
<a href="/dashboard">Go to Dashboard</a>
<img src="/avatar.png" alt="Profile photo" />
```

Some elements are self-closing (no content): `<img />`, `<br />`, `<input />`.

### Semantic HTML

Use elements that describe their **meaning**, not their appearance:

| Element     | Purpose                | Not this                |
| ----------- | ---------------------- | ----------------------- |
| `<nav>`     | Navigation links       | `<div class="nav">`     |
| `<main>`    | Primary content        | `<div id="content">`    |
| `<article>` | Self-contained content | `<div class="post">`    |
| `<section>` | Thematic grouping      | `<div class="section">` |
| `<header>`  | Introductory content   | `<div class="header">`  |
| `<footer>`  | Footer content         | `<div class="footer">`  |
| `<button>`  | Clickable action       | `<div onclick="...">`   |
| `<form>`    | Data submission        | `<div class="form">`    |

Why it matters:

- **Accessibility** — screen readers understand semantic elements
- **SEO** — search engines use semantic structure
- **Maintainability** — `<nav>` is clearer than `<div class="nav">`

### JSX: HTML in JavaScript

In React (and TanStack Start), you write **JSX** — a syntax that looks like HTML
but is actually JavaScript:

```tsx
function ProfileCard() {
  const username = "alice";
  return (
    <article>
      <h2>{username}'s Profile</h2>
      <p>Full-stack developer</p>
    </article>
  );
}
```

Key differences from HTML:

- Use `className` instead of `class` (because `class` is a JavaScript keyword)
- Use `htmlFor` instead of `for` (same reason)
- Self-closing tags are required: `<img />` not `<img>`
- Use `{}` to embed JavaScript expressions
- Everything must return a **single parent element** (or a Fragment `<>...</>`)

### The DOM (Document Object Model)

When the browser receives HTML, it builds a **tree structure** called the DOM:

```
html
├── head
│   ├── meta
│   └── title
└── body
    ├── nav
    │   └── a (href="/")
    ├── main
    │   ├── h1
    │   └── p
    └── script
```

Each node in this tree is a **DOM element**. JavaScript (and React) interact
with this tree to:

- Read content (`document.querySelector('h1').textContent`)
- Change content (React does this efficiently via the **virtual DOM**)
- Listen for events (clicks, form submissions, key presses)

### React and the Virtual DOM

React maintains a **virtual DOM** — a JavaScript representation of the actual
DOM. When your component state changes:

1. React creates a new virtual DOM tree
2. Compares it with the previous virtual DOM (diffing)
3. Updates only the changed parts of the real DOM (reconciliation)

This is why you rarely touch the DOM directly in React. You describe **what**
the UI should look like, and React handles **how** to update it.

```tsx
// ❌ Don't do this in React — direct DOM manipulation
document.getElementById("counter").textContent = count + 1;

// ✅ Do this in React — declarative
function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>Count: {count}</button>;
}
```

> `useState` is a React hook for managing component state — you'll learn it in
> [Module 08](../08-state-and-interactivity/). The key takeaway here: in React,
> you describe **what** the UI should look like, and React handles the DOM.

### Common HTML Elements You'll Use

| Element         | Purpose                           | DevStack Bio usage                |
| --------------- | --------------------------------- | --------------------------------- |
| `<div>`         | Generic container                 | Layout wrapper                    |
| `<h1>`–`<h6>`   | Headings                          | Page titles, section headers      |
| `<p>`           | Paragraph text                    | Bio text, descriptions            |
| `<a>`           | Links (use `<Link>` for internal) | External profile links            |
| `<img>`         | Images                            | Profile avatars                   |
| `<form>`        | Form container                    | Login, registration, profile edit |
| `<input>`       | Text input                        | Email, password, username fields  |
| `<textarea>`    | Multi-line input                  | Bio field                         |
| `<button>`      | Clickable button                  | Save, Delete, Add Link            |
| `<ul>` / `<li>` | Lists                             | Link list on profile page         |
| `<table>`       | Tabular data                      | Analytics view counts             |

## Commands You'll Use

No new commands in this module. You're editing files and the dev server picks up
changes automatically.

## Common Patterns

| Pattern                 | JSX                                                        |
| ----------------------- | ---------------------------------------------------------- |
| Embed a variable        | `<h1>{username}</h1>`                                      |
| Conditional render      | `{isLoggedIn && <Dashboard />}`                            |
| List rendering          | `{links.map(link => <li key={link.id}>{link.title}</li>)}` |
| Attribute with variable | `<img src={avatarUrl} alt={displayName} />`                |
| Self-closing tag        | `<input type="text" />`                                    |
| Fragment (no wrapper)   | `<>...</>` or `<Fragment>...</Fragment>`                   |

## What We Built: Added Semantic Structure to DevStack Bio

### Step 1: Updated the root layout with semantic HTML

In `src/routes/__root.tsx`, we updated the `RootComponent` to use semantic
elements:

```tsx
function RootComponent() {
  return (
    <RootDocument>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <header>
          <nav className="border-b bg-white px-6 py-4">
            <div className="flex items-center justify-between max-w-4xl mx-auto">
              <Link to="/" className="text-xl font-bold">
                DevStack Bio
              </Link>
              <div className="flex gap-4">
                <Link to="/" activeProps={{ className: "font-bold" }}>
                  Home
                </Link>
              </div>
            </div>
          </nav>
        </header>
        <main className="max-w-4xl mx-auto px-6 py-8 flex-1">
          <Outlet />
        </main>
        <footer className="border-t py-4 text-center text-sm text-gray-500">
          DevStack Bio — A learning project
        </footer>
      </div>
    </RootDocument>
  );
}
```

### Step 2: Updated the public profile page with semantic markup

In `src/routes/$username.tsx`, we updated `PublicProfilePage`:

```tsx
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/$username")({
  component: PublicProfilePage,
});

function PublicProfilePage() {
  const { username } = Route.useParams();

  return (
    <article className="max-w-md mx-auto text-center">
      <header>
        <img
          src={`https://api.dicebear.com/9.x/initials/svg?seed=${username}`}
          alt={`${username}'s avatar`}
          className="w-24 h-24 rounded-full mx-auto"
        />
        <h1 className="mt-4 text-3xl font-bold">{username}</h1>
        <p className="mt-2 text-gray-600">Developer profile coming soon.</p>
      </header>
      <section className="mt-8">
        <h2 className="text-lg font-semibold">Links</h2>
        <ul className="mt-4 space-y-3">
          <li>
            <a
              href="#"
              className="block rounded-lg border p-3 hover:bg-gray-50"
            >
              GitHub
            </a>
          </li>
          <li>
            <a
              href="#"
              className="block rounded-lg border p-3 hover:bg-gray-50"
            >
              Portfolio
            </a>
          </li>
        </ul>
      </section>
    </article>
  );
}
```

### Step 3: Verified

We visited `/alice` and saw a profile page with avatar, name, and placeholder
links. We checked the browser DevTools → Elements tab to confirm `<article>`,
`<header>`, `<section>`, `<nav>` elements were present.

### Step 4: Committed

```bash
git add .
git commit -m "Add semantic HTML structure to profile page and root layout"
```

## Deep Dive

- [MDN — HTML Elements Reference](https://developer.mozilla.org/en-US/docs/Web/HTML/Element)
- [MDN — Introduction to HTML](https://developer.mozilla.org/en-US/docs/Learn/HTML/Introduction_to_HTML)
- [MDN — The DOM](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Introduction)
- [React — JSX](https://react.dev/learn#writing-markup-with-jsx)
- [MDN — Semantic HTML](https://developer.mozilla.org/en-US/docs/Glossary/Semantics#semantics_in_html)

---

**Next:** [Module 06 — Styling with Tailwind](../06-styling-with-tailwind/) →
Make your pages look good with utility classes.
