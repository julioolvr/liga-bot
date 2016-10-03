const controller = require('./controller')
const withMiddleware = require('./middleware/withMiddleware')
const getTournamentId = require('./middleware/getTournamentId')

const COMMANDS = {
  nextMatch: require('./commands/nextMatch'),
  changeName: require('./commands/changeName'),
  changeCup: require('./commands/changeCup'),
  status: require('./commands/status')
}

class Bot {
  constructor(token) {
    this.token = token
    this.controller = controller
  }

  start() {
    this.setup()
    this.controller.spawn({
      token: this.token
    }).startRTM()
  }

  setup() {
    this.controller.hears(
      'siguiente',
      ['direct_message', 'direct_mention'],
      withMiddleware(getTournamentId)(COMMANDS.nextMatch)
    )

    this.controller.hears(
      'cambiar nombre',
      ['direct_message', 'direct_mention'],
      withMiddleware(getTournamentId)(COMMANDS.changeName)
    )

    this.controller.hears(
      'cambiar copa',
      ['direct_message', 'direct_mention'],
      COMMANDS.changeCup
    )

    this.controller.hears(
      'status',
      ['direct_message', 'direct_mention'],
      COMMANDS.status
    )
  }
}

module.exports = Bot
