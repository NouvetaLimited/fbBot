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
// nouveta let token = 'EAADUxvcXkUUBABgmyHgbiwZBcGPykKz0ZB0jurLrV8JkJcNPWJ6ZAGIZCAKNaFR65r34wttH7XC5lNqB8ZCtqZAv3bvQd4rzVmhzVXjaoqgaDHQcGTBOcZAzsVxuFuuwZCmSzQ54XZBPConKIASPnx8lldSyEjfQlB1YSW7JnR8SXYvSPOlw4K6ui'
//let token = "EAADUxvcXkUUBAKynDiAdz4l47j9uJupmbqXQ05ZAfCexmYtAoZC3W1YYuJMnxgryLcvu3tEaIZBYeZAU0hYmGV8lEGeeiXRGvSPvKQ0RxOMGZBQJZBtKiZCpFpjbtiVerJFQVYivtGfTuek3h5cSEEpCif3ZBLmfItw6OEe6x12RpPNoiomlMZAmO"
//let token = "EAADUxvcXkUUBAE213i5BGeQTPXmFEJQJZAoqZCliz66n1b8ctZAiL2tfBZAKkYTvrLRbQtzBTKaT5A0iZCxgA7mu8Wo59NrXFLFndKZBvpOifzOtyXbckJ7ZAwcSZCT1NsEVzdMwH8rSoSuODzwjN1wt09F3k6xmYUAc18vlebz4dlvKeZBeW6ZCuf"
let token = "EAADUxvcXkUUBAIs1XyodXQ1lbRRZB9KLhypCirHIADxXZB0DFQZAvkHhjMSLl5KnVrIOJWVbUIawC28jzlH4KozPKSifoyMZAkWq9wXVkR3suumZBTh2ZAPeqEDc6yQLQaf58pJ2o6uZCbZBPW9tZAkTLT8j2k2no3w1DPRN26IvPIGQDZAFliGMBq"
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
            console.log(".......................................................................",text);

            decideMessage(sender, text)
        }

        if(event.postback){
            let text = JSON.stringify(event.postback.payload)
            decideMessage(sender, text)
            console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>',text);

        }
    }
    res.sendStatus(200);
});
