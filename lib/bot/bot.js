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
    this.controller.hears('siguiente', ['direct_message', 'direct_mention'], (bot, message) => {
      const username = '@someone' // TODO: Replace by the username of the user that sent the message

      COMMANDS.nextMatch(username, 'tournamentId')
        .then(opponentName => bot.reply(message, `${username}, tu siguiente oponente es ${opponentName}`))
    })
  }
}

module.exports = Bot
