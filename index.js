'use strict'

const express= require('express')
const bodyParser= require('body-parser')
const request= require('request')
const axios = require('axios')

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
     if(text.includes("get started")){
         sendText(sender, "Hi, My name is Kunta. I am National Bank of Kenya's virtual agent. Press the buttons bellow to choose the service you want?")
         sendButtonMessage(sender,"choose one")

     }else if(text.includes("exists")){
        //sendGenericMessage(sender)
        sendButtonMessage2(sender,"Choose the service youll like to use")
     }
     else if(text.includes("load")){
       //sendText(sender,"You can load your account using Mpesa. Enter your phone number below Or if its a different Number enter on the editor")
       quickReply(sender)
     }
     else if(text.includes("acc")){
       quickReplyAcc(sender)
     }
     else if(text.icludes('balance')){
       sendText(sender, "Thank the request has been received, Youll receive a text message on your registered number with your acc balance.")
       sendButtonMessage2(sender,"Choose the service youll like to use")
     }
     else if(text.includes("mini")){
       sendText(sender, "Thank the request has been received, Youll receive a text message on your registered number with your Ministatement.")
       sendButtonMessage2(sender,"Choose the service youll like to use")
     }
     else if(text.includes("statement")){
       sendButtonStatement(sender,"Do you want a")
     }
     else if(text.includes("hard")){
       sendText(sender, "We've received your request visit any NBK branch and pick. Thank you")
       sendButtonMessage2(sender,"Choose the service youll like to use")
     }
     else if(text.includes("soft")){
       sendText(sender, "You will receive your statement on your email registered to us")
       sendButtonMessage2(sender,"Choose the service youll like to use")
     }
     else if(text.includes("book")){
       sendButtonCheque(sender,"How many leve")
     }
     else if(text.includes("25L")){
       sendText(sender, "Thank you We've received your request once its ready well inform you . Thank you")
       sendButtonMessage2(sender,"Choose the service youll like to use")
     }
     else if(text.includes("254")){
       console.log("I am the number", text);
      let  phoneNumber = text
       sendText(sender,"send the amount you'll wish to deposit starting with a then the amount. for example for 500 enter a500")
     }
     else if(text.includes("5")){
       sendText(sender,"Youll receive a push notification shortly")
       console.log("I am amount",text);
        let amount = text
       axios.post(`https://payme.ticketsoko.com/api/index.php?function=CustomerPayBillOnline&PayBillNumber=175555&Amount=500&PhoneNumber=254715428709&AccountReference=tickets&TransactionDesc=yolo`)
  .then(function (response) {
    console.log(response);
    console.log("This is me",phoneNumber);
  })
  .catch(function (error) {
    console.log(error);
  });
     }
}

function sendButtonMessage(sender, text){
    let messageData={
        "attachment":{
            "type":"template",
            "payload":{
                "template_type":"button",
                "text":text,
                "buttons":[
                    {
                        "type":"postback",
                        "title":"I have an account",
                        "payload":"exists"
                    },
                    {
                        "type":"postback",
                        "title":"Im not a NBK customer",
                        "payload":"not"
                    }
                ]
            }
        }
    }
     sendRequest(sender, messageData)
}
//the buttin for hard copy and SoftCopy
function sendButtonStatement(sender, text){
    let messageData={
        "attachment":{
            "type":"template",
            "payload":{
                "template_type":"button",
                "text":text,
                "buttons":[
                    {
                        "type":"postback",
                        "title":"Hard copy",
                        "payload":"hard"
                    },
                    {
                        "type":"postback",
                        "title":"Soft Copy",
                        "payload":"soft"
                    }
                ]
            }
        }
    }
     sendRequest(sender, messageData)
}
// the user second buttons
function sendButtonMessage2(sender, text){
    let messageData={
        "attachment":{
            "type":"template",
            "payload":{
                "template_type":"button",
                "text":text,
                "buttons":[
                    {
                        "type":"postback",
                        "title":"Account Request",
                        "payload":"acc"
                    },
                    {
                        "type":"postback",
                        "title":"Transactions",
                        "payload":"trans"
                    },
                    {
                        "type":"postback",
                        "title":"General service",
                        "payload":"gen"
                    }

                ]
            }
        }
    }
     sendRequest(sender, messageData)
}
// cheque response
function sendButttonCheque(sender, text){
    let messageData={
        "attachment":{
            "type":"template",
            "payload":{
                "template_type":"button",
                "text":text,
                "buttons":[
                    {
                        "type":"postback",
                        "title":"25 leve",
                        "payload":"25l"
                    },
                    {
                        "type":"postback",
                        "title":"50 leve",
                        "payload":"25l"
                    },

                ]
            }
        }
    }
     sendRequest(sender, messageData)
}
//quickReply
function quickReply(sender){
  let messageData={
      "text": "Select your Phone number",
      "quick_replies":[
        {
          "content_type":"user_phone_number"
        },
        {
          "content_type":"location"
        }
      ]
    }
  sendRequest(sender, messageData);
}
/**
Account
*/
function quickReplyAcc(sender){
  let messageData={
      "text": "Select your Phone number",
      "quick_replies":[
        {
        "content_type":"text",
        "title":"check balance",
        "payload":"balance",
        //"image_url":"http://example.com/img/red.png"
        },
        {
        "content_type":"text",
        "title":"request Ministatement",
        "payload":"mini",
        //"image_url":"http://example.com/img/red.png"
       },
       {
       "content_type":"text",
       "title":"Request full statement",
       "payload":"statement",
       //"image_url":"http://example.com/img/red.png"
     },
     {
       "content_type":"text",
       "title":"Cheque book request",
       "payload":"book",
       //"image_url":"http://example.com/img/red.png"
     }
   ]
    }
  sendRequest(sender, messageData);
}

function sendRequest(sender, messageData) {
    request({
        url: "https://graph.facebook.com/v2.6/me/messages",
        qs : {access_token : token},
        method: "POST" ,
        json: {
            recipient: {id: sender},
            message: messageData,
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
            }
        }
    }
    sendRequest(sender, messageData)
}
function sendGenericMessage(sender){
    let messageData= {
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
        sendRequest(sender, messageData)

}

app.listen(app.get('port'),function () {
    console.log("running: port");
});
