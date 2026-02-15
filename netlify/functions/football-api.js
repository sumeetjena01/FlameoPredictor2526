// Netlify serverless function to proxy football-data.org API
// This keeps the API key secret (stored as a Netlify environment variable)

// In-memory cache: stores responses for 5 minutes
const cache = {};
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes in ms

exports.handler = async (event) => {
  const API_KEY = process.env.FOOTBALL_DATA_API_KEY;

  if (!API_KEY) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "FOOTBALL_DATA_API_KEY environment variable not set" }),
    };
  }

  const path = event.queryStringParameters?.path || "";

  // Check cache first
  const cached = cache[path];
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, max-age=300",
        "X-Cache": "HIT",
      },
      body: cached.body,
    };
  }

  const url = `https://api.football-data.org/v4/${path}`;

  try {
    const response = await fetch(url, {
      headers: {
        "X-Auth-Token": API_KEY,
      },
    });

    const data = await response.json();
    const body = JSON.stringify(data);

    // Only cache successful responses
    if (response.status === 200) {
      cache[path] = {
        body,
        timestamp: Date.now(),
      };
    }

    return {
      statusCode: response.status,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, max-age=300",
        "X-Cache": "MISS",
      },
      body,
    };
  } catch (error) {
    // If API call fails but we have stale cache, use it as fallback
    if (cached) {
      return {
        statusCode: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Cache-Control": "public, max-age=300",
          "X-Cache": "STALE",
        },
        body: cached.body,
      };
    }

    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch data from football-data.org" }),
    };
  }
};