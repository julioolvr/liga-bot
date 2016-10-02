const ChallongeClient = require('challonge/api')

const client = new ChallongeClient(process.env.CHALLONGE_KEY)

class Tournament {
  constructor(id) {
    this.id = id
  }

  playerIdForName(playerName) {
    return client.players(this.id)
      .then(players => players.map(player => player.participant))
      .then(players => players.find(player => player.name === playerName))
      .then(player => player ? player.id : undefined)
  }

  nextOpenGameFor(playerId) {
    return client.matches(this.id, { state: 'open' })
      .then(matches => matches.map(match => match.match))
      .then(matches => matches.find(match => match.player1_id === playerId || match.player2_id === playerId))
  }

  playerNameFor(playerId) {
    return client.player(this.id, playerId)
      .then(player => player.participant.name)
  }
}

module.exports = Tournament
