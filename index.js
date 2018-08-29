'use strict'

const express= require('express');
const bodyParser= require('body-parser');
const request= require('request');

const app = express();

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

res.send ("HI welcome")
});

/**
 * token
 */

const  token = "EAANb0QutBe8BAJyjQjPOvKJSXgBNZBZC5CDM4fKoA6EhScJiIZBYbqhl1JXVm557jBAZCWR1sH3M1h1JxtzeDI8oeFEs82PMduYZClHLVDtMZA8InZCK4ZCtcZBEzXKs6gn35zhaxiadzZBYiilwTtc1hZBZBZBGiCABIoRVTzZAJKCvMBJBX9usZCHcPDZA"

/**
 * FACEBOOK
 */

app.get('/webhook/', function (req, res){
    if(req.query['hub.verify_token']==="chirchir"){
        res.send(req.query['hub.challenge'])
    }
    res.send('wrong token')
});

app.post('/webhook/', function(req, res){
     let messaging_events =  req.body.entry[0].messaging_events
    for (let i = 0; 1 < messaging_events.length; i++){
         let event = messaging_events[i]
        let sender = event.sender.id
        if(event.message && event.message.text){
             let text = event.message.text()
            sendText(sender,"Text echo: " + text.substring(0,100))
        }
    }
    res.sendStatus(200)
})

function sendText(sender, text){
    let messageData = {text: text}
    request({
        url: "https://graph.facebook.com/v2.6/me/messages",
        qs : {access_token, token} ,
        method: "POST" ,
        json: {
            receipt: {id: sender},
            message: messageData
        }
    }, function(error, response, body) {
        if (error) {
            console.log("sending error")
        } else if (response.body.error) {
            console.log("response body error")
        }
    }) 

}

app.listen(app.get('port'),function () {
    console.log("running: port")
});