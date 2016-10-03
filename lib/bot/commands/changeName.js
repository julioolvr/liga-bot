const winston = require('winston')

const Tournament = require('tournament')
const controller = require('bot/controller')

module.exports = function changeName(bot, message) {
  bot.api.users.info({ user: message.user }, (err, response) => {
    if (err) {
      winston.error('Error getting user info', err)
      return
    }

    const username = `@${response.user.name}`
    const tournamentId = message.cupId
    const tournament = new Tournament(tournamentId)

    new Promise(resolve => {
      controller.storage.users.get(message.user, (err, userData) => {
        resolve(!err && userData.playerId ? tournament.playerNameFor(userData.playerId) : username)
      })
    }).then(playerName => {
      bot.startConversation(message, (err, convo) => {
        if (err) {
          winston.error('Error starting conversation', err)
          return
        }

        convo.ask(`<@${message.user}>, actualmente te tengo registrado como ${playerName}, ¿querés cambiar de nombre?`, [
          {
            pattern: /^(sí|si|s)$/,
            callback: (response, convo) => {
              askNewName(convo)
              convo.next()
            }
          },
          {
            pattern: /^(no|n)$/,
            callback: (response, convo) => {
              convo.say(`Ok, seguís registrado como ${playerName}`)
              convo.next()
            }
          },
          {
            default: true,
            callback: (response, convo) => {
              convo.say('No entendí la respuesta')
              convo.next()
            }
          }
        ])

        function askNewName(convo) {
          convo.ask('¿Cuál es tu nuevo nombre?', (response, convo) => {
            tournament
              .playerIdForName(response.text)
              .then(playerId => {
                if (!playerId) {
                  convo.say('No encontré ningún jugador con ese nombre')
                  convo.next()
                } else {
                  controller.storage.users.save({ id: message.user, playerId })
                  convo.say('¡Registrado!')
                  convo.next()
                }
              })
          })
        }
      })
    })
  })
}
