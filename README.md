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

### 1. Clone & Setup Backend

```bash
# Install backend dependencies
npm install

# Setup environment variables
cp .env.example .env
```

Fill in your `.env` credentials:
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint
```

Start the backend server:
```bash
npm start
# or with nodemon
npx nodemon server.js
```

### 2. Setup Frontend

```bash
cd FrontendLearn
npm install
npm run dev
```

The application will be running at `http://localhost:5173`.

---

## 📁 Project Structure

```
├── .env.example          # Environment variables template
├── .gitignore            # Git ignore configuration
├── package.json          # Backend package config
├── server.js             # Application entrypoint
├── src/
│   ├── app.js            # Express app configuration
│   ├── controllers/      # Route controllers (Auth, Music)
│   ├── db/               # Database connection
│   ├── middlewares/      # Auth & validation middlewares
│   ├── models/           # Mongoose schemas (User, Music, Album)
│   ├── routes/           # Express API routes
│   └── services/         # ImageKit storage services
└── FrontendLearn/        # React + Vite frontend application
    ├── src/
    │   ├── components/   # UI components (player, artist studio, modals, layout)
    │   ├── context/      # React contexts (Auth, Audio, Toast)
    │   └── services/     # API integration service
```
