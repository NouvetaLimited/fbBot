'use strict'

const express= require('express')
const bodyParser= require('body-parser')
const request= require('request')

const app = express()

/*
allow to process data
 */

app.set('port',(process.env.PORT  || 5000));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


/*
ROUTES
 */

app.get('/' , function (req, res){

res.send ("HI welcome");
});

/**
 * token
 */

let token = 'EAADUxvcXkUUBAMHJKRihq21puCwj6HO5WaJ1ZAXZAVyMdN5VYZAgjGZAtTQ3BSbcki8InVZBGiPOjrrMvZCucKD3zE6DQVtmzZAafQzcOZCsg6c7xMy9TmYBEiZCt1L40Y52D7dbdB0Hf5kDbZAvdWvZAleiJPI5piyg7kFMAZAkZBj9U2WvkEkTPD1yj';

/**
 * FACEBOOK
 */

app.get('/webhook/', function (req, res){
    if(req.query['hub.verify_token']==="chirchir"){
        res.send(req.query['hub.challenge']);
    }
    res.send('wrong token');
});

app.post('/webhook/', function(req, res){
     let messaging_events =  req.body.entry[0].messaging;
    for (let i = 0; i < messaging_events.length; i++){
         let event = messaging_events[i];
        let sender = event.sender.id;
        if(event.message && event.message.text){
             let text = event.message.text;
            //sendText(sender,"Text echo: " + text.substring(0,100))

            decideMessage(sender, text)
        }

        if(event.postback){
            let text = JSON.stringify(event.postback)
            decideMessage(sender, text)

        }
    }
    res.sendStatus(200);
});

function decideMessage(sender, text1){
    let text = text1.toLowerCase()
     if(text.includes("summer")){
        sendImageMessage(sender)

     }else if(text.includes("winter")){
        sendGenericMessage(sender)
     }else{
        sendText(sender, "I like fall")
         sendButtonMessage(sender, "im here")
     }
}

function sendButtonMessage(sender, text){
    let messageData={
        "attachment":{
            "type":"template",
            "payload":{
                "template_type":"button",
                "text": text,
                "buttons":[
                    {
                        "type":"postback",
                        "title":"Mpesa",
                        "payload":"mpesa"
                    },
                    {
                        "type":"postback",
                        "title":"card",
                        "payload":"card"
                    }
                ]
            }
        }
    }
     sendRequest(sender, messageData)
}

function sendRequest(sender, messageData) {
    request({
        url: "https://graph.facebook.com/v2.6/me/messages",
        qs : {access_token : token},
        method: "POST" ,
        json: {
            recipient: {id: sender},
            message: messageData
        }
    }, function(error, response, body) {
        if (error) {
            console.log("sending error")
        } else if (response.body.error) {
            console.log("response body error")
        }
    });

}

function sendText(sender, text){
    let messageData = {text: text};
    sendRequest(sender, messageData)
}
function sendImageMessage(sender){
    let messageData={
        "attachment":{
            "type":"image",
            "payload":{
                "url":"http://www.messenger-rocks.com/image.jpg",
                "is_reusable":true
            }
        }
    }
    sendRequest(sender, messageData)
}
function sendGenericMessage(sender){
    let messageData= {
        "message": {
            "attachment": {
                "type": "template",
                "payload": {
                    "template_type": "generic",
                    "elements": [
                        {
                            "title": "Nouveta!",
                            "image_url": "https://petersfancybrownhats.com/company_image.png",
                            "subtitle": "We have the right hat for everyone.",
                            "default_action": {
                                "type": "web_url",
                                "url": "https://petersfancybrownhats.com/view?item=103",
                                "webview_height_ratio": "tall",
                            },
                            "buttons": [
                                {
                                    "type": "web_url",
                                    "url": "https://petersfancybrownhats.com",
                                    "title": "View Website"
                                }, {
                                    "type": "postback",
                                    "title": "Start Chatting",
                                    "payload": "DEVELOPER_DEFINED_PAYLOAD"
                                }
                            ]
                        }
                    ]
                }
            }
        }
    }
        sendRequest(sender, messageData)

}

app.listen(app.get('port'),function () {
    console.log("running: port");
});