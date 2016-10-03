const controller = require('bot/controller')

module.exports = (bot, message, next) => {
  controller.storage.teams.get(message.team, (err, teamData) => {
    if (err || !teamData.cupId) {
      bot.reply(message, 'No hay una copa configurada, usá el comando "cambiar copa" para setearla')
    } else {
      message.cupId = teamData.cupId
      next(bot, message)
    }
  })
}
