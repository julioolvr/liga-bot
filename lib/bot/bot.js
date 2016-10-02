const Botkit = require('botkit')

const COMMANDS = {
  nextMatch: require('./commands/nextMatch')
}

class Bot {
  constructor(token) {
    this.token = token
    this.controller = Botkit.slackbot()
  }

  start() {
    this.setup()
    this.controller.spawn({
      token: this.token
    }).startRTM()
  }

  setup() {
    this.controller.hears('siguiente', ['direct_message', 'direct_mention'], COMMANDS.nextMatch)
  }
}

module.exports = Bot
