const winston = require('winston')

const controller = require('bot/controller')

module.exports = function status(bot, message) {
  controller.storage.teams.get(message.team, (err, teamData) => {
    if (err) {
      winston.error('Error getting team data', err)
      return
    }

    bot.reply(message, `Id de la copa actual: \`${teamData.cupId || 'Not defined'}\``)
  })
}
