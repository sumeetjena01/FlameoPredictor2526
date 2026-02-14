# ⚽ Flameo Predictor — Race for Europe 2025/26

A Premier League predictor app tracking **Chelsea**, **Aston Villa**, **Liverpool**, and **Manchester United** in the race for European qualification (3rd–6th place).

- **3rd, 4th, 5th** → Champions League
- **6th** → Europa League

## Features

- **Auto-updating scores**: Results and standings refresh automatically from football-data.org every 5 minutes — no more manual updates!
- **Predict remaining games**: Click W (win), D (draw), or L (loss) for each fixture
- **Linked predictions**: When two tracked teams face each other, selecting a result for one auto-fills the other
- **Projected standings**: See how your predictions change the table in real time
- **Mobile-friendly**: Fully responsive dark-themed UI

## Setup & Deployment

### 1. Get a free API key

1. Go to [football-data.org](https://www.football-data.org/client/register)
2. Register for a **free** account
3. Copy your API token from the dashboard

### 2. Deploy to Netlify

**Option A: Deploy from GitHub (recommended)**

1. Push this repo to your GitHub account
2. Go to [Netlify](https://app.netlify.com) → **Add new site** → **Import an existing project**
3. Connect your GitHub repo
4. Build settings (should auto-detect):
   - **Build command**: `npm run build`
   - **Publish directory**: `build`
5. Under **Site settings** → **Environment variables**, add:
   - Key: `FOOTBALL_DATA_API_KEY`
   - Value: *your API token from step 1*
6. Trigger a redeploy

**Option B: Netlify CLI**

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Initialize (from the project directory)
netlify init

# Set the environment variable
netlify env:set FOOTBALL_DATA_API_KEY your_api_key_here

# Deploy
npm run build
netlify deploy --prod
```

### 3. Local development

```bash
# Install dependencies
npm install

# Create a .env file for local development
echo "FOOTBALL_DATA_API_KEY=your_api_key_here" > .env

# Start dev server (you'll also need Netlify Dev for the serverless function)
npx netlify dev
```

> **Note**: Use `npx netlify dev` instead of `npm start` so the serverless function at `/api/football-api` works locally.

## How It Works

### Architecture

```
Browser (React App)
  ↓ fetch /api/football-api?path=...
Netlify Function (netlify/functions/football-api.js)
  ↓ proxies request with API key
football-data.org API
  ↓ returns PL standings + matches
React App displays data + user predictions
```

### Why a serverless function?

The football-data.org API requires an API key. Instead of exposing it in client-side code, the Netlify Function acts as a secure proxy — it adds the API key server-side and forwards requests to the API.

### Data refresh

- Standings and match data refresh **every 5 minutes** automatically
- You can also click the ↻ button to refresh manually
- Completed matches are automatically detected — no manual updating needed!

## Project Structure

```
├── netlify/
│   └── functions/
│       └── football-api.js    # Serverless API proxy
├── public/
│   └── index.html             # HTML template
├── src/
│   ├── App.js                 # Main React application
│   ├── App.css                # Styles
│   └── index.js               # Entry point
├── netlify.toml                # Netlify config
├── package.json
└── README.md
```

## Customization

### Change tracked teams

In `src/App.js`, edit the `TRACKED_TEAMS` object. Team IDs can be found at [football-data.org/v4/competitions/PL/teams](https://api.football-data.org/v4/competitions/PL/teams).

### Change qualification rules

Edit the `QUALIFICATION` object in `src/App.js` to change which positions get which European spots.

## Credits

- **Data**: [football-data.org](https://www.football-data.org) (free tier)
- **Created by**: [SKJ Sports](https://skjsports.com)
- **Built with**: React, Netlify Functions

## License

MIT
