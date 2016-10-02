const winston = require('winston')

const Tournament = require('tournament')
const controller = require('bot/controller')

function askForPlayerNameAndGetId(bot, message, username, tournament) {
  return new Promise((resolve, reject) => {
    bot.startConversation(message, (err, convo) => {
      if (err) {
        winston.error('Error starting conversation', err)
        reject(err)
        return
      }

      convo.ask(`${username}, no te pude encontrar en el torneo, ¿cuál es tu nombre en challonge?`, (message, convo) => {
        tournament
          .playerIdForName(message.text)
          .then(playerId => {
            if (!playerId) {
              convo.repeat()
              convo.next()
            } else {
              resolve(playerId)
              convo.next()
            }
          })
      })
    })
  })
}

module.exports = function nextMatch(bot, message) {
  bot.api.users.info({ user: message.user }, (err, response) => {
    if (err) {
      winston.error('Error getting user info', err)
      return
    }

    const username = `@${response.user.name}`
    const tournamentId = 'tournamentId'
    const tournament = new Tournament(tournamentId)

    new Promise(resolve => {
      controller.storage.users.get(message.user, (err, userData) => {
        resolve(!err && userData.playerId ? userData.playerId : tournament.playerIdForName(username))
      })
    })
      .then(playerId => playerId ? playerId : askForPlayerNameAndGetId(bot, message, username, tournament))
      .then(playerId => {
        controller.storage.users.save({ id: message.user, playerId })
        return playerId
      })
      .then(playerId => Promise.all([playerId, tournament.nextOpenGameFor(playerId)]))
      .then(([playerId, match]) => {
        if (!match) {
          bot.reply(message, `${username}, no tenés juegos en espera`)
          return
        }

        const opponentId = match.player1_id === playerId ? match.player2_id : match.player1_id
        tournament
          .playerNameFor(opponentId)
          .then(opponentName => bot.reply(message, `${username}, tu próximo partido es contra ${opponentName}`))
      })
  })
}
