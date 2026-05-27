# 04 — SSH Keys

## The short version

**SSH (Secure Shell)** is a protocol for securely connecting to remote
computers. **SSH keys** are a pair of cryptographic files — one private, one
public — that prove your identity without sending a password. You'll use them to
push to GitHub and connect to servers.

## How SSH keys work

```
Your computer                           Server (GitHub, VPS, etc.)
┌─────────────────┐                     ┌─────────────────┐
│  Private key     │                     │  Public key      │
│  (never share!)  │ ──── challenge ────▶│  (safe to share) │
│  ~/.ssh/id_ed25519│                     │  authorized_keys │
└─────────────────┘                     └─────────────────┘
```

1. You keep the **private key** on your computer. Never share it.
2. You put the **public key** on the server (GitHub, your VPS, etc.).
3. When you connect, your private key proves your identity mathematically — no
   password sent.

## Generate an SSH key

```bash
ssh-keygen -t ed25519 -C "your_email@example.com"
```

- Press **Enter** to accept the default file location (`~/.ssh/id_ed25519`).
- Enter a **passphrase** (optional but recommended — protects your key if
  someone gets your computer).

This creates two files:

- `~/.ssh/id_ed25519` — your **private key** (never share this)
- `~/.ssh/id_ed25519.pub` — your **public key** (safe to share)

## Add your key to the SSH agent

The SSH agent remembers your passphrase so you don't type it every time.

```bash
# Start the SSH agent
eval "$(ssh-agent -s)"

# Add your private key
ssh-add ~/.ssh/id_ed25519
```

**macOS users:** If you want the passphrase stored in your keychain:

```bash
ssh-add --apple-use-keychain ~/.ssh/id_ed25519
```

## Add your public key to GitHub

1. Copy your public key to the clipboard:
   ```bash
   cat ~/.ssh/id_ed25519.pub
   ```
2. Go to [github.com/settings/keys](https://github.com/settings/keys)
3. Click **New SSH key**
4. Paste the public key, give it a title (e.g., "My Laptop")
5. Click **Add SSH key**

## Test the connection

```bash
ssh -T git@github.com
```

You should see:

```
Hi username! You've successfully authenticated, but GitHub does not provide shell access.
```

If this works, you can now `git push` and `git pull` over SSH instead of HTTPS.

## Connect to a server

```bash
ssh username@your-server-ip
```

For this to work, the server needs your public key in `~/.ssh/authorized_keys`.
Most cloud providers (DigitalOcean, AWS, etc.) let you add your SSH key when
creating a server.

## Key types

| Type         | Recommendation                                                            |
| ------------ | ------------------------------------------------------------------------- |
| **Ed25519**  | Best choice. Modern, fast, secure. Supported since OpenSSH 6.5 (2014).    |
| **RSA 4096** | Fallback if Ed25519 isn't supported. Use `-b 4096` for adequate security. |
| **DSA**      | **Deprecated.** Do not use.                                               |

## Common commands

| Command                            | Purpose                        |
| ---------------------------------- | ------------------------------ |
| `ssh-keygen -t ed25519 -C "email"` | Generate a new key pair        |
| `ssh-add ~/.ssh/id_ed25519`        | Add key to SSH agent           |
| `ssh-add -l`                       | List keys loaded in the agent  |
| `ssh -T git@github.com`            | Test GitHub SSH connection     |
| `ssh user@host`                    | Connect to a remote server     |
| `scp file.txt user@host:/path/`    | Copy a file to a remote server |

## Deep dive

- [GitHub: Generating a new SSH key](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent)
  — step-by-step guide
- [GitHub: Adding a new SSH key to your account](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/adding-a-new-ssh-key-to-your-github-account)
- [SSH Essentials](https://www.digitalocean.com/community/tutorials/ssh-essentials-working-with-ssh-servers-clients-and-keys)
  — DigitalOcean guide
- [Secure Secure Shell](https://stribika.github.io/2015/01/04/secure-secure-shell.html)
  — hardening your SSH configuration

---

**Next:** [Docker Concepts](./05-docker-concepts.md) → Package your app to run
anywhere.
