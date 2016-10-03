// TODO: Do this dynamically, defining commands and descriptions on the commands themselves.
module.exports = function status(bot, message) {
  const availableCommands = [
    '*siguiente*: Busca tu oponente para el siguiente partido',
    '*cambiar nombre*: Setea el nombre que usás en Challonge',
    '*cambiar copa*: Cambia el id de la copa actual',
    '*status*: Muestra la configuración actual del bot',
    '*comandos*: Muestra esta lista'
  ]

  bot.reply(message, availableCommands.join('\n'))
}
