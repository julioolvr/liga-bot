const Botkit = require('botkit')

module.exports = this.controller = Botkit.slackbot({
  json_file_store: './db'
})
