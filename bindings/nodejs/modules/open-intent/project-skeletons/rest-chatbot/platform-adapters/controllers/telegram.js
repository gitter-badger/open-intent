
/**
 * Telegram
 */
var TelegramBot = require('node-telegram-bot-api');
var telegramConfig = require('../config/telegram/default.json')

var token = telegramConfig.API_TOKEN;
// Setup polling way

module.exports.attach = function () {
    var tlbot = new TelegramBot(token, {polling: true});

    // Any kind of message
    tlbot.on('message', function (msg) {
        var senderId = msg.from.id;
        var content = msg.text;
        chatbot_client.talk(senderId, content).then(function(replies) {
            var reply = replies.length ? replies[0] : "An error occured";
            bot.sendMessage(senderId, reply);
        });
    });
}