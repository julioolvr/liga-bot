require('dotenv').config();

const ChallongeClient = require('./lib/challonge/api') // TODO: all paths relative to lib? or root or something

const client = new ChallongeClient(process.env.CHALLONGE_KEY)

const tournamentId = 'some-tournament'
const user = 'some-user'

client.players(tournamentId)
  .then(players => players.map(player => player.participant))
  .then(players => players.find(player => player.name === user).id)
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
      .then(opponent => {
        console.log(`${user}, tu próximo oponente es ${opponent.name}`)
      })
  })
