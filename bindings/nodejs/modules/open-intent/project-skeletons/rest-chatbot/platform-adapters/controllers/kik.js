'use strict';
/**
 * Kik
 */

let Bot  = require('@kikinteractive/kik');
var kikConfig = require('../config/kik/default.json');

// Configure the bot API endpoint, details for your bot
let bot = new Bot(kikConfig);

bot.updateBotConfiguration();

var replyHandler = function(message, reply) {
    message.reply(reply);
}

var messageHandler = function(chatbotClient, message) {
   chatbotClient.talk(message.from, message.body).then(function(replies) {
        var reply = '';
        if (replies.length)
            reply = replies[0];
        else
            reply = "An error occured";
        replyHandler(message, reply);
   });     
}

//Weird and all but I guess this route is enforced by the lib
module.exports.attach = function (chatbotClient, app) {
    bot.onTextMessage((message) => {
        messageHandler(chatbotClient, message);
    });

    app.post('/incoming', bot.incoming());
}