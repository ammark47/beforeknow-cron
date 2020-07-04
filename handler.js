'use strict';
const axios = require('axios')
const moment = require('moment');
const StreamChat = require('stream-chat').StreamChat
const CHAT_DAY_LIMIT = 4.0
const BEFORE_KNOW_CEO = 'ammark1111_gmail_com'

require('custom-env').env(process.env.NODE_ENV)
const { STREAM_API_KEY, STREAM_APP_SECRET } = require('./config')

module.exports.run = async (event, context, callback) => {
  const streamChatServerClient = new StreamChat(
    STREAM_API_KEY,
    STREAM_APP_SECRET,
    {
      logger: (logLevel, message, extraData) => {
        console.log(message);
      }
    }
  )

  // get all channels that are not with the head honcho
  const filter = { type: 'messaging', members: { $nin: [BEFORE_KNOW_CEO] }, status: 'ACTIVE' }
  const channels = await streamChatServerClient.queryChannels(filter)

  for (const c of channels) {
    // need to extract all old data because channel.update overwrites
    const { data } = c
    const { customer, name, productName, reviewId, reviewer, created_at, chatId } = data

    // calculate how many days has passed since chat creation
    const now = moment()
    const chatCreatedAtMoment = moment(created_at)
    var duration = moment.duration(now.diff(chatCreatedAtMoment))
    var daysPassedSinceCreation = duration.asDays()

    console.log("found", now, chatCreatedAtMoment, daysPassedSinceCreation)

    if (daysPassedSinceCreation >= CHAT_DAY_LIMIT) {
      console.log('updating', c.data)
      try {
        await c.update({
          customer,
          name,
          productName,
          reviewId,
          reviewer,
          chatId,
          frozen: true,
          status: 'ARCHIVED'
        })
        
        // update postgres -> archive chat and grant reviewer 1 token
        const response = axios.patch("http://localhost:8080/chat/archive", { chatId })
        console.log(response)

      } catch (error) {
        console.error(error)
      }


    }

  }

}
