'use strict';
const axios = require('axios')
const StreamChat = require('stream-chat').StreamChat

require('custom-env').env(process.env.NODE_ENV) 
const { STREAM_API_KEY, STREAM_APP_SECRET } = require('./config')

module.exports.run = async (event, context, callback) => {
  const streamChatServerClient = new StreamChat(
    STREAM_API_KEY,
    STREAM_APP_SECRET ,
    {
      logger: (logLevel, message, extraData) => {
        console.log(message);
      }
    }
  )

  const filter = { type: 'messaging', members: { $nin: ['ammark1111_gmail_com'] } }
  const channels = await streamChatServerClient.queryChannels(filter)

  for (const c of channels) {
    console.log(c.data.created_at, c.cid);
  }

}
