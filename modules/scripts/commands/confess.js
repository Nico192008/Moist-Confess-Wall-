module.exports.config = {
  name: "postfb",
  author: "Yan Maglinte",
  version: "1.0",
  category: "Social",
  description: "Posts a message to a Facebook Page.",
  adminOnly: false,
  usePrefix: true,
  cooldown: 5, // Cooldown time in seconds
};

module.exports.run = function ({ event, args, api, pageAccessToken }) {
  const message = args.join(' '); // Combine the arguments to form the message

  if (!message) {
    return api.sendMessage("Please provide a message to post on the page.", event.threadID);
  }

  const pageId = "61572215923283";  // Replace with your actual Page ID

  // Send the post request to Facebook's Graph API
  api.httpPost(`https://graph.facebook.com/v13.0/${pageId}/feed`, {
    message: message,
    access_token: pageAccessToken,
  }, (err, info) => {
    if (err) {
      return api.sendMessage("Failed to create the post. Please try again later.", event.threadID);
    }

    try {
      if (typeof info == "string") info = JSON.parse(info.replace("for (;;);", ""));
      const postId = info.id;
      const postUrl = `https://www.facebook.com/${pageId}/posts/${postId}`;

      // If post is successful, send the post URL back to the user
      api.sendMessage(`Post created successfully! You can view it here: ${postUrl}`, event.threadID);
    } catch (e) {
      api.sendMessage("Post creation failed, please try again later.", event.threadID);
    }
  });
};
        
