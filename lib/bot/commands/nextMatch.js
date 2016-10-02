const ChallongeClient = require('challonge/api')

const client = new ChallongeClient(process.env.CHALLONGE_KEY)

module.exports = function nextMatch(forPlayer, tournamentId) {
  return client.players(tournamentId)
    .then(players => players.map(player => player.participant))
    .then(players => players.find(player => player.name === forPlayer).id)
    .then(playerId => {
      return client.matches(tournamentId, { state: 'open' })
        .then(matches => matches.map(match => match.match))
        .then(matches => matches.find(match => match.player1_id === playerId || match.player2_id === playerId))
        .then(match => match.player1_id === playerId ? match.player2_id : match.player1_id)
        // TODO: Consider when the player is in no open match
    })
    .then(opponentId => {
      return client.player(tournamentId, opponentId)
        .then(opponent => opponent.participant)
        .then(opponent => opponent.name)
    })
}
