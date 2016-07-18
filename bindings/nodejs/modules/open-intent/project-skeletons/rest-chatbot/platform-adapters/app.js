'use strict';

const 
  crypto = require('crypto'),
  request = require('request'),
  express = require('express'),
  fs = require('fs'),
  ChatbotClient = require('open-intent/lib/rest-client')

var app = express();
var chatbot_client = new ChatbotClient("http://localhost:8080");

app.set('port', process.env.PORT || 5000);
app.use(express.static('public'));

var baseUrl = require("./config/general").baseUrl;

var platforms = {};
platforms['kik'] = require("./controllers/kik");
platforms['messenger'] = require("./controllers/messenger");
platforms['skype'] = require("./controllers/skype");
platforms['slack'] = require("./controllers/slack");
platforms['telegram'] = require("./controllers/telegram");

var selection = require("./config/selection")

function deployPlatform(platformName, platform, isSelected) {  
   var message = platformName;
   var webhook = baseUrl;
   webhook += platformName === 'kik' ? '/incoming' : '/'+platformName+'/chat';
   if (selection[platformName]) {
     console.log("setting up "+platformName);
     if (platformName !== 'telegram' &&  platformName !== 'slack')
        console.log("the webhook is : "+webhook);  
     platform.attach(chatbot_client, app);   
   } else {
   }
}

for (var platformName in platforms) {
    if (platforms.hasOwnProperty(platformName)) {
      deployPlatform(platformName, platforms[platformName], app);  
    }
}

console.log("Server listening at "+app.get('port'));
app.listen(app.get('port')); 
