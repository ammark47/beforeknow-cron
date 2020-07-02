'use strict';
const axios = require('axios')

module.exports.run = (event, context, callback) => {
  axios.post('https://52720713a0e180375a43fd43286e1ef3.m.pipedream.net', { timestamp: new Date() })
  .then(response => callback(null, { message: 'We ran your scheduled job', response }))
  .catch(err => callback(true, err))
}
