<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# OUROZ - The Amazigh Source

B2B/B2C marketplace for Moroccan artisan products, powered by Google Gemini AI.

## Run Locally

**Prerequisites:** Node.js 18+

### 1. Install dependencies

```bash
# Frontend
npm install

# Backend
cd server && npm install
```

### 2. Set up your API key

Copy your Gemini API key to `server/.env`:

```bash
cp server/.env.example server/.env
# Then edit server/.env and add your key
```

Get your API key at: <https://aistudio.google.com/apikey>

### 3. Run the app

**Terminal 1 - Start the backend:**

```bash
cd server
npm run dev
```

**Terminal 2 - Start the frontend:**

```bash
npm run dev
```

Open <http://localhost:3000> in your browser.

## Architecture

- **Frontend**: React 19 + Vite + Tailwind CSS
- **Backend**: Express.js proxy server (keeps API key secure)
- **AI**: Google Gemini (images, video, voice, chat)

The backend proxy ensures your API key is never exposed to the browser.
