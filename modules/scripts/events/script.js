module.exports.config = {
  name: 'The Script of Everything',
  author: 'Yan Maglinte',
  version: '1.0',
  description: 'Allows you to input code here without the need for prefixes or names; it will execute automatically.',
  selfListen: false,
};

let enter = false;
module.exports.run = async function({ event, args }) {
  if (event.type === 'message' && !enter) {
    api.graph({
      recipient: {
        id: event.sender.id
      },
      message: {
        attachment: {
          type: 'template',
          payload: {
            template_type: 'generic',
            elements: [
              {
                title: 'Hey there newbie!', // The title of the generic message
                subtitle: 'Thank you for using MOIST Confess Wall Page.Please Like And Follow And Invite Your Friends This Page.', // The subtitle of the message
                image_url: 'https://github.com/Nico192008/Moist-Confess-Wall-/raw/refs/heads/main/e042ed9c-2981-4606-bc6c-6b1c2e06c87b.webp', // The image URL
                buttons: [
                  {
                    type: 'web_url',
                    url: 'https://www.facebook.com/nics.i.101675',
                    title: 'Check my Profile'
                  },
                  {
                    type: 'postback',
                    title: `${PREFIX}help`,
                    payload: 'HELP_PAYLOAD'
                  }
                ]
              }
            ]
          }
        }
      }
    });
    enter = true;
  };

  /** EVENT TYPES
   * postback
   * quick_reply
   * message_reaction
   * message_reply
   * message
   * mark_as_seen
   * @Nico Adajar **/
};
