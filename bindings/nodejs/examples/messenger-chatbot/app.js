/*
|---------------------------------------------------------|
|    ___                   ___       _             _      |
|   / _ \ _ __   ___ _ __ |_ _|_ __ | |_ ___ _ __ | |_    |
|  | | | | '_ \ / _ \ '_ \ | || '_ \| __/ _ \ '_ \| __|   |
|  | |_| | |_) |  __/ | | || || | | | ||  __/ | | | |_    |
|   \___/| .__/ \___|_| |_|___|_| |_|\__\___|_| |_|\__|   |
|        |_|                                              |
|                                                         |
|     - The users first...                                |
|                                                         |
|     Authors:                                            |
|        - Clement Michaud                                |
|        - Sergei Kireev                                  |
|                                                         |
|     Version: 1.0.0                                      |
|                                                         |
|---------------------------------------------------------|

The MIT License (MIT)
Copyright (c) 2016 - Clement Michaud, Sergei Kireev

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
var MessengerBot = require('./messenger');
var OpenIntent = require('open-intent');
var ngrok = require('ngrok');

var port = process.env.PORT || 8445;


// Get Messenger parameters
var FB_PAGE_ID = process.env.FB_PAGE_ID && Number(process.env.FB_PAGE_ID);
if (!FB_PAGE_ID) {
    throw new Error('missing FB_PAGE_ID');
}
var FB_PAGE_TOKEN = process.env.FB_PAGE_TOKEN;
if (!FB_PAGE_TOKEN) {
    throw new Error('missing FB_PAGE_TOKEN');
}
const FB_VERIFY_TOKEN = process.env.FB_VERIFY_TOKEN;

console.log("FB_PAGE_ID: " + FB_PAGE_ID);
console.log("FB_PAGE_TOKEN: " + FB_PAGE_TOKEN);
console.log("FB_VERIFY_TOKEN: " + FB_VERIFY_TOKEN);


ngrok.connect({
    proto: 'http',
    addr: port
}, startChatbot);

function startChatbot(err, url) {
    if(err) {
        console.error(err);
        process.exit(1);
    }

    console.log("ngrok is forwarding from " + url + " to localhost:" + port);

    var fs = require('fs');
    var chatbot = new OpenIntent.Chatbot();

    var DICTIONARY_FILE = 'res/dictionary.json';
    var SCRIPT_FILE = 'res/script.txt';
    var USERCOMMANDS_FILE = 'res/user_commands.js';

    var dictionary = fs.readFileSync(DICTIONARY_FILE, 'utf-8');
    var script = fs.readFileSync(SCRIPT_FILE, 'utf-8');
    var userCommands = fs.readFileSync(USERCOMMANDS_FILE, 'utf-8');

    var botmodel = {
        'model': {
            'script': script,
            'dictionary': dictionary
        },
        'commands': {
            'type': 'js',
            'script': userCommands
        }
    }

    chatbot.setModel(botmodel)
    .then(messengerClientCallback(chatbot))
    .fail(function(err) {
        console.error('Error: ' + err);
    })
}

function messengerClientCallback(chatbot) {

    return function() {
        messenger = MessengerBot(port, FB_VERIFY_TOKEN, FB_PAGE_TOKEN, function(client, message) {
            var sessionId = client.sessionId;

            //console.log(sessionId + ' - ' + message);
            chatbot.talk(sessionId, message)
            .then(function(replies) {
                var reply = replies.join(', ');

                console.log(reply);
                client.send(reply);
            })
            .fail(function(err) {
                console.error('Error: ' + err);
            })
        });
    }
}

process.on('SIGINT', function() {
    console.log( "\nGracefully shutting down from SIGINT (Ctrl-C)" );
    process.exit(0);
});
