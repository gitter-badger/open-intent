
'use strict';
/**
 * Skype
 */
const skype = require('skype-sdk');
const skypeconfig = require('../config/skype/default.json')

const skypeBotId = process.env.SKYPE_BOT_ID || skypeconfig.BOT_ID;
const skypeAppId = process.env.SKYPE_APP_ID || skypeconfig.APP_ID;
const skypeAppSecret = process.env.SKYPE_APP_SECRET || skypeconfig.APP_SECRET;
const restify = require("restify");

var server = restify.createServer();
const botService = new skype.BotService({
    messaging: {
        botId: skypeBotId,
        serverUrl : "https://apis.skype.com",
        requestTimeout : 15000,
        appId: skypeAppId,
        appSecret: skypeAppSecret
    }
});

botService.on('contactAdded', (bot, data) => {
    bot.reply(`Hello ${data.fromDisplayName}!`, true);
});

module.exports.attach = function(chatbotClient, app) {

    botService.on('personalMessage', (bot, data) => {
        chatbotClient.talk(data.from, data.content).then(function(replies) {
            var reply = replies.length ? replies[0] : "An error occured";
            bot.reply(reply, true)
        });
    }); 

    app.post('/skype/chat', skype.messagingHandler(botService));
}