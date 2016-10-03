module.exports = (...middlewares) => handler => (bot, message) => {
  middlewares.concat(handler).reverse().reduce((prev, current) => {
    return current.bind(null, bot, message, prev)
  }, () => {})()
}
