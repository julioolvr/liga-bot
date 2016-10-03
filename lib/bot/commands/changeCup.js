const winston = require('winston')

const Tournament = require('tournament')
const controller = require('bot/controller')

module.exports = function changeCup(bot, message) {
  bot.startConversation(message, (err, convo) => {
    if (err) {
      winston.error('Error starting conversation', err)
      return
    }

    convo.ask('Pasame el id de la copa actual', (message, convo) => {
      const tournament = new Tournament(message.text)

      tournament
        .getTournament()
        .then(() => {
          controller.storage.teams.save({ id: message.team, cupId: message.text })
          convo.say('¡Guardado!')
          convo.next()
        })
        .catch(() => {
          convo.say('No pude encontrar una copa con ese id')
          convo.next()
        })
    })
  })
}
