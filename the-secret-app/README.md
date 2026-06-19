# ✦ The Secret — Local Setup Guide

## How to run this website locally

Since this is a pure HTML/CSS/JS site, you have two options:

### Option A — VS Code Live Server (recommended)
1. Open the `the-secret-app` folder in VS Code
2. Install the "Live Server" extension
3. Right-click `index.html` → **Open with Live Server**
4. The site opens at `http://127.0.0.1:5500`

### Option B — Python quick server
```bash
cd the-secret-app
python3 -m http.server 8080
```
Then open `http://localhost:8080` in your browser.

---

## Setting Up EmailJS (Free — 200 emails/month)

EmailJS lets you send emails from the browser without any backend.

### Step 1 — Create account
Go to https://www.emailjs.com and sign up for free.

### Step 2 — Add an Email Service
- Dashboard → **Email Services** → Add New Service
- Choose Gmail (or any provider)
- Connect your Gmail account
- Note your **Service ID** (e.g. `service_abc123`)

### Step 3 — Create an Email Template
- Dashboard → **Email Templates** → Create New Template
- Set **To Email**: `{{to_email}}`
- Set **Subject**: `✦ Your wish has been granted by the Universe`
- Set **Body** (paste this):

```
Dear {{to_name}},

The Universe has received your order and it is already done.

Your wish:
"{{affirmation}}"

Your wishes are granted. They are on their way to you. They are already yours.

Believe. Feel it. Receive it.

With love,
The Universe

— Ordered on {{date}}
```

- Note your **Template ID** (e.g. `template_xyz789`)

### Step 4 — Get your Public Key
- Dashboard → **Account** → **API Keys**
- Copy your **Public Key**

### Step 5 — Update the config
Open `js/email.js` and replace:
```js
publicKey:  'YOUR_EMAILJS_PUBLIC_KEY',   ← paste your Public Key
serviceId:  'YOUR_SERVICE_ID',           ← paste your Service ID
templateId: 'YOUR_TEMPLATE_ID',          ← paste your Template ID
```

---

## Pages

| Page | File | Purpose |
|------|------|---------|
| Home / Ask | `index.html` | Enter email + wish, choose to order or save |
| Wishlist | `wishlist.html` | Floating bubble wishes, hover to order |
| Order | `order.html` | Fill the affirmation blank, place order |
| My Wishes | `ordered.html` | All ordered wishes — already yours |

---

## Data Storage
All data is stored in **localStorage** in the browser — no server needed.
- `secret_email` — the user's email
- `secret_wishlist` — saved (unordered) wishes
- `secret_ordered` — ordered wishes

To clear all data: open browser console → `localStorage.clear()`
