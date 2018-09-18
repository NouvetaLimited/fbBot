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

//let token = 'EAADUxvcXkUUBAMHJKRihq21puCwj6HO5WaJ1ZAXZAVyMdN5VYZAgjGZAtTQ3BSbcki8InVZBGiPOjrrMvZCucKD3zE6DQVtmzZAafQzcOZCsg6c7xMy9TmYBEiZCt1L40Y52D7dbdB0Hf5kDbZAvdWvZAleiJPI5piyg7kFMAZAkZBj9U2WvkEkTPD1yj';
let token = 'EAADUxvcXkUUBABgmyHgbiwZBcGPykKz0ZB0jurLrV8JkJcNPWJ6ZAGIZCAKNaFR65r34wttH7XC5lNqB8ZCtqZAv3bvQd4rzVmhzVXjaoqgaDHQcGTBOcZAzsVxuFuuwZCmSzQ54XZBPConKIASPnx8lldSyEjfQlB1YSW7JnR8SXYvSPOlw4K6ui'

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
    let service = text
     if(text.includes("get started")){
         sendText(sender, "Hi, My name is Kunta. I am National Bank of Kenya's virtual agent. Press the buttons bellow to choose the service you want?")
         sendButtonMessage(sender,"choose one")

     }else if(text.includes("exists")){
        //sendGenericMessage(sender)
        sendButtonMessage2(sender,"Choose the service youll like to use")
     }
     /*else if(text.includes("load")){
       //sendText(sender,"You can load your account using Mpesa. Enter your phone number below Or if its a different Number enter on the editor")
       quickReply(sender)
     }*/
     else if(text.includes("acc")){
       quickReplyAcc(sender)
     }
     else if(text.includes('balance')){
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
     else if(text.includes("25l")){
       sendText(sender, "Thank you We've received your request once its ready well inform you . Thank you")
       sendButtonMessage2(sender,"Choose the service youll like to use")
     }
     else if(text.includes("trans")){
       sendQuickTrans(sender,"Choose the service youll like to use")
     }
     else if(text.includes("deposit")){
       axios.post(`https://ticketsoko.com/bot/index.php?function=lastmessage&Pid=${sender}&message=${text}`)
        .then(function (response) {
          console.log(response);
          console.log("This is me",phoneNumber);
        })
        .catch(function (error) {
          console.log(error);
        });
        console.log("I am the service", sender);
        quickReply(sender)
     }
     else if(text.includes("254")){
       axios.post(`https://ticketsoko.com/bot/index.php?function=lastmessage&Pid=${sender}&message=${text}`)
        .then(function (response) {
          const data= response.status
          console.log(response);
          console.log("This is me",phoneNumber);
        })
        .catch(function (error) {
          console.log(error);
        });
       console.log("I am the number", text);
      let  phoneNumber = text
       sendText(sender,"please enter the amount you will wish to deposit")
     }
           else if(text.includes("fer")){
             console.log("im the service",text)
             let service = text
             sendText(sender,"please enter the acount number you will wish to transfer starting with the Bank example NBK123")
           }
           else if(service === "fer"){
             sendText(sender,"you will recieve an OTP enter the OTP here to confirm the transaction")
             let service = "fer2"
           }
           else if(service === "fer2"){
             sendText(sender,"wrong OTP")
             sendQuickTrans(sender,"Choose the service youll like to use")
           }

          else if(text.includes("gen")){
            sendButtonGen(sender,"This are general services available")
          }
          else if(text.includes("locate")){
            let service = "loc"
            quickReplyLoc(sender)
          }
          else if(service === "loc"){
            sendText(sender,"The nearest branch is NBK .. opens at 8 and closses at 5. The Atms available are .... they work 24/7")
            sendButtonGen(sender,"This are general services available")
          }
          else if(text.includes("pay")){
          quickReplyPay(sender)
          }
          else if (text.includes("water")) {
            let service = text
            sendText(sender,"please enter the amount you will wish to pay")
          }
          else if (service === "water"){
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

          else if(text.includes("kibet")){
          sendText(sender,"US DOLLAR	100.7472	100.6472	100.8472")
          sendButtonGen(sender,"This are general services available")
          }
          else{
              //sendText(sender,text)
              axios.post(`https://ticketsoko.com/bot/index.php?function=lastmessage&Pid=${sender}`)
               .then(function (response) {
                 console.log(response);
                 console.log(response.message)
                 const service = response.data.message[0]
               })
               .catch(function (error) {
                 console.log(error);
               });
                if(service === "deposit"){
                 sendText(sender,"Youll receive a push notification shortly")
                 console.log("I am amount",text);
                  let amount = text
                 axios.post(`https://ticketsoko.com/bot/index.php?function=lastmessage&Pid=${sender}&message=${text}`)
                  .then(function (response) {
                    const data= response.status
                    console.log(response);
                    console.log("This is me",phoneNumber);
                  })
                  .catch(function (error) {
                    console.log(error);
                  });
                     }

          }
        }

/**
functions
*/
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
//general services
function sendButtonGen(sender, text){
  let messageData={
      "attachment":{
          "type":"template",
          "payload":{
              "template_type":"button",
              "text":text,
              "buttons":[
                  {
                      "type":"postback",
                      "title":"Branch/ATM locator",
                      "payload":"locate"
                  },
                  {
                      "type":"postback",
                      "title":"Pay Merchant",
                      "payload":"pay"
                  },
                  {
                      "type":"postback",
                      "title":"Exchange Rate",
                      "payload":"kibet"
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
                    },

                ]
            }
        }
    }
     sendRequest(sender, messageData)
}
// cheque response
function sendButtonCheque(sender, text){
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
      "text": "Here is your phone number if not shown that means you dont have a number on your profile.You can enter your number from the text area starting with 254",
      "quick_replies":[
        {
          "content_type":"user_phone_number"
        },
        // {
        //   "content_type":"location"
        // }
      ]
    }
  sendRequest(sender, messageData);
}
/**
location
*/
function quickReplyLoc(sender){
  let messageData={
      "text": "Please click on the button below and share your location",
      "quick_replies":[
        {
          "content_type":"location"
        },
        // {
        //   "content_type":"location"
        // }
      ]
    }
  sendRequest(sender, messageData);
}
/**
Account
*/
function quickReplyAcc(sender){
  let messageData={
      "text": "Select your response swipe left for more replies",
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
         "title":"request statement",
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
/**
quick reply PayB
*/
function quickReplyPay(sender){
  let messageData={
      "text": "Select your response swipe left for more replies",
      "quick_replies":[
        {
        "content_type":"text",
        "title":"Nairobi water",
        "payload":"water",
        //"image_url":"http://example.com/img/red.png"
        },
        {
        "content_type":"text",
        "title":"buy airtime",
        "payload":"water",
        //"image_url":"http://example.com/img/red.png"
       },
       {
       "content_type":"text",
       "title":"Nairobi county services",
       "payload":"water",
       //"image_url":"http://example.com/img/red.png"
     },
     {
       "content_type":"text",
       "title":"Others",
       "payload":"water",
       //"image_url":"http://example.com/img/red.png"
     }
   ]
    }
  sendRequest(sender, messageData);
}
/**
transaction button
*/
function sendQuickTrans(sender){
  let messageData={
      "text": "Please select your response bellow",
      "quick_replies":[
        {
        "content_type":"text",
        "title":"deposit",
        "payload":"chir",
        //"image_url":"http://example.com/img/red.png"
        },
        {
        "content_type":"text",
        "title":"Transfer to annother Account",
        "payload":"fer",
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
