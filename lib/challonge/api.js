const got = require('got')
const querystring = require('querystring')

const BASE_URL = 'https://api.challonge.com/v1'

class Client {
  constructor(apiKey) {
    this.apiKey = apiKey
  }

  player(tournamentId, playerId, options = {}) {
    return this._request(`tournaments/${tournamentId}/participants/${playerId}.json`, options);
  }

  players(tournamentId, options = {}) {
    return this._request(`tournaments/${tournamentId}/participants.json`, options);
  }

  matches(tournamentId, options = {}) {
    return this._request(`tournaments/${tournamentId}/matches.json`, options)
  }

  _request(path, options) {
    return got(`${BASE_URL}/${path}?api_key=${this.apiKey}&${querystring.stringify(options)}`, { json: true })
      .then(response => response.body)
  }
}

module.exports = Client
