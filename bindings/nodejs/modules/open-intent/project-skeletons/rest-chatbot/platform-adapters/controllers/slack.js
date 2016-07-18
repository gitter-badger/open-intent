
/**
 * Slack
 */
var RtmClient = require('@slack/client').RtmClient;
var RTM_EVENTS = require('@slack/client').RTM_EVENTS;
var slackConfig = require('../config/slack/default.json');

var token = process.env.SLACK_API_TOKEN || slackConfig.API_TOKEN;

module.exports.attach = function (chatbotClient) {
    var rtm = new RtmClient(token, { logLevel: 'warning' });
    rtm.start();

    rtm.on(RTM_EVENTS.MESSAGE, function handleRtmMessage(message) {
        var channel = message.channel;
        var content = message.text;
        chatbotClient.talk(channel, content).then(function(replies) {
            var reply = replies.length ? replies[0] : "An error occured";
            rtm.sendMessage(reply, channel);
        });
    });
}