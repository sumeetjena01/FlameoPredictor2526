// Netlify serverless function to proxy football-data.org API
// This keeps the API key secret (stored as a Netlify environment variable)

exports.handler = async (event) => {
  const API_KEY = process.env.FOOTBALL_DATA_API_KEY;

  if (!API_KEY) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "FOOTBALL_DATA_API_KEY environment variable not set" }),
    };
  }

  const path = event.queryStringParameters?.path || "";
  const url = `https://api.football-data.org/v4/${path}`;

  try {
    const response = await fetch(url, {
      headers: {
        "X-Auth-Token": API_KEY,
      },
    });

    const data = await response.json();

    return {
      statusCode: response.status,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, max-age=300", // Cache for 5 minutes
      },
      body: JSON.stringify(data),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch data from football-data.org" }),
    };
  }
};
