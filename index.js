require('dotenv').config();

const Bot = require('bot/bot')

const bot = new Bot(process.env.SLACK_TOKEN)
bot.start()
