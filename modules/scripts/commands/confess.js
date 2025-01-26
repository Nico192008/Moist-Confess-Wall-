const axios = require("axios");
const fs = require("fs");

const COUNTER_FILE = "./postCounter.json";

// Function to load the counter from the file
function loadCounter() {
  if (fs.existsSync(COUNTER_FILE)) {
    try {
      const data = fs.readFileSync(COUNTER_FILE, "utf8");
      return JSON.parse(data).counter || 0;
    } catch (error) {
      console.error("Error reading counter file:", error.message);
      return 0;
    }
  }
  return 0;
}

// Function to save the counter to the file
function saveCounter(counter) {
  try {
    fs.writeFileSync(COUNTER_FILE, JSON.stringify({ counter }, null, 2));
  } catch (error) {
    console.error("Error saving counter file:", error.message);
    throw new Error("Failed to save the post counter.");
  }
}

// Load the counter at the start
let postCounter = loadCounter();

module.exports.config = {
  name: "confess",
  author: "Yan Maglinte",
  version: "1.2",
  category: "Social",
  description:
    "Posts a message to a Facebook Page with an automatically incrementing counter.",
  adminOnly: false,
  usePrefix: true,
  cooldown: 5,
};

module.exports.run = async function ({ event, args, api }) {
  // Check if api is available
  if (!api) {
    console.error("API object is undefined.");
    return;
  }

  const messageContent = args.join(" ");

  if (!messageContent) {
    return api.sendMessage(
      "Please provide a message to post on the page.",
      event.threadID
    );
  }

  try {
    postCounter += 1;
    saveCounter(postCounter);
  } catch (error) {
    return api.sendMessage(
      "Failed to save the post counter. Please check file permissions.",
      event.threadID
    );
  }

  const message = `confess #${postCounter}: ${messageContent}`;

  // Page ID and Access Token (Replace with actual values)
  const pageId = "61572215923283"; // Replace with the correct numeric Page ID
  const pageAccessToken =
    "YOUR_PAGE_ACCESS_TOKEN"; // Replace with a valid token

  const graphApiUrl = `https://graph.facebook.com/v17.0/${pageId}/feed`;

  try {
    const response = await axios.post(graphApiUrl, {
      message: message,
      access_token: pageAccessToken,
    });

    const postId = response.data.id;
    const postUrl = `https://www.facebook.com/${pageId}/posts/${postId}`;

    api.sendMessage(
      `Post created successfully! You can view it here: ${postUrl}`,
      event.threadID
    );
  } catch (error) {
    const errorMessage =
      error.response?.data?.error?.message || error.message || "Unknown error";
    const errorDetails = error.response?.data || {};
    console.error("Error creating post:", { errorMessage, errorDetails });

    api.sendMessage(
      `Failed to create the post. Error: ${errorMessage}`,
      event.threadID
    );
  }
};
      
