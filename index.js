'use strict'

const express= require('express');
const bosyParser= require('bodyParser');
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
 * FACEBOOK
 */

app.get('/webhook/', function (req, res){
    if(req.query['hub.verify_token']==="chirchir"){
        res.send(req.query['hub.verify_token'])
    }
    res.send('wrong token')
});

app.listen(app.get('port'),function () {
    console.log("running: port")
});