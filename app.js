const express = require("express");
const axios = require("axios");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const PORT = 3000;

// Function to fetch YouTube videos
const fetchYouTubeVideos = async (keyword) => {
  try {
    const options = {
      method: "GET",
      url: "https://yt-api.p.rapidapi.com/search",
      params: { query: keyword },
      headers: {
        "x-rapidapi-key": process.env.RAPIDAPI_KEY,
        "x-rapidapi-host": "yt-api.p.rapidapi.com",
      },
    };

    const response = await axios.request(options);
    console.log("YouTube API Response:", response.data); // Log full response for debugging

    // Check if the response contains items and map to URLs
    if (
      response.data &&
      response.data.items &&
      Array.isArray(response.data.items)
    ) {
      return response.data.items.map((item) => item.url); // Return the URLs
    }
    throw new Error("No items found in YouTube API response");
  } catch (error) {
    console.error("YouTube API Error:", error.message || error);
    throw new Error("Error fetching YouTube data");
  }
};

// Function to fetch Instagram videos
const fetchInstagramVideos = async (keyword) => {
  try {
    const options = {
      method: "GET",
      url: "https://instagram-scraper-api3.p.rapidapi.com/media_by_keyword",
      params: { query: keyword },
      headers: {
        "x-rapidapi-key": process.env.RAPIDAPI_KEY,
        "x-rapidapi-host": "instagram-scraper-api3.p.rapidapi.com",
      },
    };

    const response = await axios.request(options);
    console.log("Instagram API Response:", response.data); // Log full response for debugging

    // Check if response.data is an array or object and handle accordingly
    if (Array.isArray(response.data)) {
      return response.data.map((item) => item.media_url); // Return media URLs
    }
    if (response.data && response.data.items) {
      return response.data.items.map((item) => item.media_url); // Fallback if the structure is different
    }

    throw new Error("No media found in Instagram API response");
  } catch (error) {
    console.error("Instagram API Error:", error.message || error);
    throw new Error("Error fetching Instagram data");
  }
};

// YouTube videos endpoint
app.get("/youtube", async (req, res) => {
  try {
    const keyword = req.query.keyword || "cute dogs"; // Default keyword if none provided
    const youtubeUrls = await fetchYouTubeVideos(keyword);

    // Send YouTube URLs as JSON response
    if (youtubeUrls.length > 0) {
      res.json({
        youtubeUrls,
      });
    } else {
      res.status(404).json({ error: "No YouTube videos found" });
    }
  } catch (error) {
    console.error("YouTube API Error:", error.message || error);
    res.status(500).json({ error: "Error fetching YouTube data" });
  }
});

// Instagram videos endpoint
app.get("/instagram", async (req, res) => {
  try {
    const keyword = req.query.keyword || "cute dogs"; // Default keyword if none provided
    const instagramUrls = await fetchInstagramVideos(keyword);

    // Send Instagram URLs as JSON response
    if (instagramUrls.length > 0) {
      res.json({
        instagramUrls,
      });
    } else {
      res.status(404).json({ error: "No Instagram videos found" });
    }
  } catch (error) {
    console.error("Instagram API Error:", error.message || error);
    res.status(500).json({ error: "Error fetching Instagram data" });
  }
});

// Serve static files (if needed) or a simple page for testing
app.use(express.static("public"));

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
