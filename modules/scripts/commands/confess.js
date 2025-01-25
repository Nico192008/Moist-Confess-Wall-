const axios = require('axios');

module.exports = {
  name: 'confess',
  description: 'Post a message to a Facebook Page',
  usage: 'postfb [message]',
  author: 'Nics',

  async execute(senderId, args, pageAccessToken) {
    try {
      const message = args.join(' '); // Combine the message parts
      if (!message) {
        return sendMessage(senderId, { text: 'Please provide a message to post on the page.' }, pageAccessToken);
      }

      // Replace 'your_page_id' with the actual Page ID
      const pageId = '61572215923283';
      
      // Send the message to the Facebook Page feed
      const { data } = await axios.post(`https://graph.facebook.com/v13.0/${pageId}/feed`, {
        message,
        access_token: pageAccessToken,
      });

      if (data.id) {
        const postUrl = `https://www.facebook.com/${pageId}/posts/${data.id}`;
        sendMessage(senderId, { text: `Post created successfully! View it here: ${postUrl}` }, pageAccessToken);
      } else {
        sendMessage(senderId, { text: 'Failed to create the post. Please try again later.' }, pageAccessToken);
      }
    } catch (error) {
      sendMessage(senderId, { text: 'An error occurred while posting. Please try again later.' }, pageAccessToken);
    }
  }
};

function sendMessage(senderId, message, pageAccessToken) {
  // Function to send message back to the user (you can customize it based on your bot's sendMessage method)
  axios.post(`https://graph.facebook.com/v13.0/me/messages?access_token=${pageAccessToken}`, {
    recipient: { id: senderId },
    message: message,
  }).catch(error => console.log(error));
}
