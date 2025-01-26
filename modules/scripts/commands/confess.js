const axios = require("axios"); // Import Axios for HTTP requests
const fs = require("fs"); // Import the File System module for saving the counter

// Path to the counter file
const COUNTER_FILE = "./postCounter.json";

// Function to load the counter from the file
function loadCounter() {
  if (fs.existsSync(COUNTER_FILE)) {
    try {
      const data = fs.readFileSync(COUNTER_FILE, "utf8");
      return JSON.parse(data).counter || 0;
    } catch (error) {
      console.error("Error reading counter file:", error.message);
      return 0; // Default to 0 if the file is corrupted
    }
  }
  return 0; // Default to 0 if the file doesn't exist
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
  version: "1.1",
  category: "Social",
  description:
    "Posts a message to a Facebook Page with an automatically incrementing counter.",
  adminOnly: false,
  usePrefix: true,
  cooldown: 5, // Cooldown time in seconds
};

module.exports.run = async function ({ event, args, api }) {
  // Combine the arguments into the message to post
  const messageContent = args.join(" ");

  // Validate if the user has provided a message
  if (!messageContent) {
    return api.sendMessage(
      "Please provide a message to post on the page.",
      event.threadID
    );
  }

  // Increment the counter and save it
  try {
    postCounter += 1;
    saveCounter(postCounter);
  } catch (error) {
    return api.sendMessage(
      "Failed to save the post counter. Please check file permissions.",
      event.threadID
    );
  }

  // Add numbering to the message (e.g., "confess #1")
  const message = `confess #${postCounter}: ${messageContent}`;

  // Page ID and Access Token (Replace with actual values)
  const pageId = "61572215923283"; // Replace with your actual Page ID
  const pageAccessToken =
    "EAAUG0iogqEYBO3w4z29cFbZCNr1dAuoyFCiWijDZCInY9eWV84K9iSyaMn6I9vCuNxKH17CroScK8UsbAnXhMsQohZCm9rBwPDErI8bhtGA2dWxRZBbEapbO768J3TnAknamSIZCFKuBsRUultQQ8T3kQyflmxC5ZBL8DxMztH1nilrEgph4BYZC0WZCcMOu8ZBKKDAZDZD"; // Replace with a valid token

  // Facebook Graph API endpoint for posting
  const graphApiUrl = `https://graph.facebook.com/v17.0/${pageId}/feed`;

  try {
    // Make the POST request using Axios
    const response = await axios.post(graphApiUrl, {
      message: message,
      access_token: pageAccessToken,
    });

    // Extract the post ID to create the post URL
    const postId = response.data.id;
    const postUrl = `https://www.facebook.com/${pageId}/posts/${postId}`;

    // Send the post link back to the user
    api.sendMessage(
      `Post created successfully! You can view it here: ${postUrl}`,
      event.threadID
    );
  } catch (error) {
    // Log and send error messages
    console.error("Error creating post:", {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });

    api.sendMessage(
      `Failed to create the post. Error: ${error.response?.data?.error?.message || error.message}`,
      event.threadID
    );
  }
};
    
