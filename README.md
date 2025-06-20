# 🧠 Woo Plugin Wizard

Generate install-ready, single-file WooCommerce plugins instantly using AI. Just describe your need — the plugin code will be generated, displayed, and made ready for download or copy.

---

## 🚀 Features

- 🌈 Beautiful Dark/Light themed UI  
- ✨ Instant plugin generation from user prompt  
- 🧾 Monaco-powered PHP code editor  
- 💾 Download PHP file directly  
- 📋 Copy code to clipboard  
- 🔁 Prompt suggestions  
- 🌐 Deployed on Vercel (frontend) + Render (backend)

---

## 🛠️ Tech Stack

| Part       | Tech                        |
|------------|-----------------------------|
| Frontend   | Vite + React + Tailwind CSS |
| Backend    | Express.js + Gemini 1.5 Pro API |
| Hosting    | Vercel (frontend), Render (backend) |
| Editor     | Monaco Editor               |

---

## 🧩 Folder Structure

```
.
├── frontend
│   ├── src
│   │   └── App.tsx         # Main UI and logic
│   ├── index.html
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── backend
│   ├── index.js            # Express server
│   ├── .env                # Contains GEMINI_API_KEY
│   └── package.json
```

---

## 🧪 Local Development

### 1. Clone the repo

```bash
git clone https://github.com/your-username/woo-plugin-wizard.git
cd woo-plugin-wizard
```

### 2. Setup Backend

```bash
cd backend
npm install

# Create .env file
echo "GEMINI_API_KEY=your-google-genai-key" > .env

# Start server
node index.js
```

### 3. Setup Frontend

```bash
cd ../frontend
npm install
npm run dev
```

Visit: `http://localhost:5173`

---

## 🔧 Production Deployment

### Render (Backend)
- Deploy `/backend` as a Web Service
- Add `GEMINI_API_KEY` as environment variable
- Start command: `node index.js`

### Vercel (Frontend)
- Deploy `/frontend`
- Add `VITE_API_URL=https://your-backend.onrender.com/api/generate` as env var
- Set framework = Vite

---

## 📄 API Contract

**POST** `/api/generate`

**Body:**

```json
{
  "prompt": "Change add to cart button color to blue"
}
```

**Response:**

```json
{
  "code": "<?php\n..."
}
```

---

## ✅ Roadmap

- [ ] Plugin folder + zip export
- [ ] Plugin metadata preview
- [ ] Syntax check before download
- [ ] Save plugin generation history
- [ ] Drag-and-drop LocalWP integration

---

## 👤 Author

Made with ❤️ by [Your Name](https://github.com/your-github)