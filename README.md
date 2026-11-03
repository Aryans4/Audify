# Audify - Full Stack Music Streaming & Artist Platform 🎵

A modern, high-performance music streaming and artist studio platform built with Node.js/Express, MongoDB, and React (Vite + Tailwind CSS).

---

## 🌟 Features

- **Listener Experience**:
  - **Dynamic Audio Player**: Real-time waveform visualizer, audio equalizer/FX rack, synchronized lyrics, and timestamped comments drawer.
  - **Mood Map**: Interactive 2D canvas navigation to discover music based on energy & valence.
  - **Categorized Discovery**: Browse by genres, albums, quick play grids, and personalized recommendations.

- **Artist Studio & AI DAW**:
  - **Track & Album Management**: Multi-file uploads (audio + cover artwork) with ImageKit cloud integration.
  - **Artist Gateway**: Seamlessly transition from listener to creator with custom moniker and bio.
  - **Interactive Album Builder**: Create and edit albums, assign tracks, and curate releases.

- **Robust Architecture**:
  - **Authentication**: JWT token authentication with bcrypt password hashing.
  - **Database**: MongoDB with Mongoose schemas for Users, Tracks, and Albums.
  - **Security**: Environment variable configuration and validation middlewares.

---

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js & Express.js
- **Database**: MongoDB & Mongoose
- **File & Media Storage**: ImageKit.io
- **Auth**: JSON Web Tokens (JWT) & bcrypt

### Frontend
- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS & Modern Glassmorphic CSS
- **Icons**: Lucide React
- **Audio & Visualizer**: Web Audio API & HTML5 Canvas

---

## 🚀 Getting Started

### 1. Setup Backend

```bash
# Install dependencies from the repository root
npm install

# Setup environment variables
Copy-Item .env.example .env
```

Fill in your `.env` credentials:
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=generate_a_long_random_secret
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint
FRONTEND_URL=https://audify-music.netlify.app
CORS_ORIGINS=https://audify-music.netlify.app
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your_smtp_username
SMTP_PASSWORD=your_smtp_password
SMTP_FROM_EMAIL=no-reply@example.com
```

For production, set the same variables in the backend host's environment settings. Configure SMTP with a verified sender address; password reset links are single-use and expire after 30 minutes. Users can sign in with either their username or email address.

Start the backend server:
```bash
npm start
# or with nodemon
npm run dev
```

### 2. Setup Frontend

```bash
cd Frontend
npm install
npm run dev
```

The application will be running at `http://localhost:5173`.

---

## 📁 Project Structure

```
├── .env.example          # Environment variables template
├── .gitignore            # Git ignore configuration
├── package.json          # Backend package config and scripts
├── package-lock.json     # Backend dependency lockfile
├── .env                  # Local backend configuration (not committed)
├── Backend/              # Express + MongoDB backend
│   ├── app.js            # Express app configuration
│   ├── server.js         # Database connection and HTTP entrypoint
│   ├── controllers/      # Route controllers (Auth, Music)
│   ├── db/               # Database connection
│   ├── middlewares/      # Auth & validation middlewares
│   ├── models/           # Mongoose schemas (User, Music, Album)
│   ├── routes/           # Express API routes
│   └── services/         # ImageKit storage services
└── Frontend/             # React + Vite frontend application
    ├── package.json      # Frontend dependencies and scripts
    ├── package-lock.json # Frontend dependency lockfile
    ├── src/
    │   ├── components/   # UI components (player, artist studio, modals, layout)
    │   ├── context/      # React contexts (Auth, Audio, Toast)
    │   └── services/     # API integration service
```
