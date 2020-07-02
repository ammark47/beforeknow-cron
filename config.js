const dotenv = require('dotenv')
dotenv.config()

module.exports = {
    mode: process.env.APP_ENV,
    STREAM_API_KEY: process.env.STREAM_API_KEY,
    STREAM_APP_SECRET: process.env.STREAM_APP_SECRET,
}