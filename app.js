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
*payments
*/
app.post('/pay/', function(req, res){
  pid=req.query['pid']
     console.log();
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
        // console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>.seeee",event);
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
// the decideMessage function
function decideMessage(sender, text1){
    let text = text1.toLowerCase()
    let service = text
    if(text.includes("get started")){
      axios.get(`https://graph.facebook.com/${sender}?fields=first_name,last_name,profile_pic&access_token=${token}`)
       .then(function (response) {
         const data= response.status
         console.log(response);
         const name = response.data.first_name
         getstarted(sender,"Hi "+name+",☺ I am Kunta and will be your agent today, how may I help you?")
         //quickReplyAcc(sender,"I am Kunta and will be your agent today, how may I help you?")
       })
       .catch(function (error) {
         console.log(error);
       });
    }
    else if(text.includes("account opening")){
      openAcc(sender,"Great, welcome to National Bank. To open an account, we will need your National ID and at least KES 100 on your MPESA to activate the account")
    }
    else if(text.includes("proceed")){
      sendText(sender,"Excellent. To start with, we need your ID number. Please enter below")
      axios.get(`https://nouveta.tech/fbbot_BE/public/index.php/api/postmessage/${sender}/idreg/${text}`)
       .then(function (response) {
         const data= response.status
         console.log(response);
       })
       .catch(function (error) {
         console.log(error);
       });
    }
    else if(text.includes("load ksh.100 now")){
      sendText(sender,"Ok. I have sent a Request-To-Pay for KES 100 to your phone number. Kindly check your phone.")
      axios.get(`https://nouveta.tech/fbbot_BE/public/index.php/api/push1/${sender}`)
       .then(function (response) {
         const data= response.status
         console.log(response);

       })
       .catch(function (error) {
         console.log(error);
       });
       //book the message
       axios.get(`https://nouveta.tech/fbbot_BE/public/index.php/api/postmessage/${sender}/paid/${text}`)
        .then(function (response) {
          const data= response.status
          console.log(response);
          axios.get(`https://graph.facebook.com/${sender}?fields=first_name,last_name,profile_pic&access_token=${token}`)
           .then(function (response) {
             const data= response.status
             console.log(response);
             const name = response.data.first_name
             returnPay(sender,""+name+", your payment has been received. Your new account number is  "+sender+". Can I tell you the services I can help you with?")
           })
           .catch(function (error) {
             console.log(error);
           });
      })
        .catch(function (error) {
          console.log(error);
        });
    }
    else if(text.includes("load more than")){
      axios.get(`https://nouveta.tech/fbbot_BE/public/index.php/api/postmessage/${sender}/paid/${text}`)
       .then(function (response) {
         const data= response.status
         console.log(response);
         axios.get(`https://graph.facebook.com/${sender}?fields=first_name,last_name,profile_pic&access_token=${token}`)
          .then(function (response) {
            const data= response.status
            console.log(response);
            const name = response.data.first_name
            returnPay(sender,""+name+", your payment has been received. Your new account number is  "+sender+". Can I tell you the services I can help you with?")
          })
          .catch(function (error) {
            console.log(error);
          });
     })
       .catch(function (error) {
         console.log(error);
       });
    }
    else if(text.includes("not now")){
      axios.get(`https://nouveta.tech/fbbot_BE/public/index.php/api/postmessage/${sender}/paid/${text}`)
       .then(function (response) {
         const data= response.status
         console.log(response);
         axios.get(`https://graph.facebook.com/${sender}?fields=first_name,last_name,profile_pic&access_token=${token}`)
          .then(function (response) {
            const data= response.status
            console.log(response);
            const name = response.data.first_name
            returnPay(sender,""+name+",. Can I tell you the services I can help you with?")
          })
          .catch(function (error) {
            console.log(error);
          });
     })
       .catch(function (error) {
         console.log(error);
       });
    }
    else if(text.includes("cancel")){
      axios.get(`https://nouveta.tech/fbbot_BE/public/index.php/api/postmessage/${sender}/paid/${text}`)
       .then(function (response) {
         const data= response.status
         console.log(response);
         axios.get(`https://graph.facebook.com/${sender}?fields=first_name,last_name,profile_pic&access_token=${token}`)
          .then(function (response) {
            const data= response.status
            console.log(response);
            const name = response.data.first_name
            returnPay(sender,""+name+",. Can I tell you the services I can help you with?")
          })
          .catch(function (error) {
            console.log(error);
          });
     })
       .catch(function (error) {
         console.log(error);
       });
    }
    else if(text.includes("load later")){
      axios.get(`https://nouveta.tech/fbbot_BE/public/index.php/api/postmessage/${sender}/paid/${text}`)
       .then(function (response) {
         const data= response.status
         console.log(response);
         axios.get(`https://graph.facebook.com/${sender}?fields=first_name,last_name,profile_pic&access_token=${token}`)
          .then(function (response) {
            const data= response.status
            console.log(response);
            const name = response.data.first_name
            returnPay(sender,""+name+",When you are ready just type load now. Can I tell you the services I can help you with?")
          })
          .catch(function (error) {
            console.log(error);
          });
     })
       .catch(function (error) {
         console.log(error);
       });
    }
    else if(text.includes("load now")){
      sendQuickPush(sender)
    }
    else if(text.includes("hi kunta")){
      axios.get(`https://graph.facebook.com/${sender}?fields=first_name,last_name,profile_pic&access_token=${token}`)
       .then(function (response) {
         const data= response.status
         console.log(response);
         const name = response.data.first_name
         sendText(sender,"Hi "+name+",  Welcome back.")
         menuMain(sender,"Below are the services I can offer you here , "+name+"")
       })
       .catch(function (error) {
         console.log(error);
       });
    }
    else if(text === 'hi'){
      axios.get(`https://graph.facebook.com/${sender}?fields=first_name,last_name,profile_pic&access_token=${token}`)
       .then(function (response) {
         const data= response.status
         console.log(response);
         const name = response.data.first_name
         sendText(sender,"Hi "+name+",  Welcome back.")
         menuMain(sender,"Below are the services I can offer you here , "+name+"")
       })
       .catch(function (error) {
         console.log(error);
       });
    }
    else{
      axios.get(`https://nouveta.tech/fbbot_BE/public/index.php/api/pastmessage/${sender}`)
       .then(function (response) {
         const data= response.status
         console.log(response);
         const message = response.data.data
         if(message === 'idreg'){
           axios.get(`https://nouveta.tech/fbbot_BE/public/index.php/api/postmessage/${sender}/reg2/${text}`)
            .then(function (response) {
              const data= response.status
              console.log(response);
              phoneNumber(sender,"Gorrit, thanks. Please provide your mobile number. Tap to confirm (if shown below) or enter a new one")
            })
            .catch(function (error) {
              console.log(error);
            });
         }
         else if(message === 'reg2'){
           axios.get(`https://nouveta.tech/fbbot_BE/public/index.php/api/register/${sender}/${text}`)
            .then(function (response) {
              const data= response.status
              console.log(response);
              axios.get(`https://nouveta.tech/fbbot_BE/public/index.php/api/postmessage/${sender}/otpreg/${text}`)
               .then(function (response) {
                 const data= response.status
                 console.log(response);
               })
               .catch(function (error) {
                 console.log(error);
               });
            })
            .catch(function (error) {
              console.log(error);
            });
            axios.get(`https://graph.facebook.com/${sender}?fields=first_name,last_name,profile_pic&access_token=${token}`)
             .then(function (response) {
               const data= response.status
               console.log(response);
               const name = response.data.first_name
               quickReplyOTP(sender,"Thanks "+name+". For validation, we have sent a One-Time Passcode to the number. Please enter the number below")
             })
             .catch(function (error) {
               console.log(error);
             });
         }
         else if(message === 'otpreg'){
           axios.get(`https://nouveta.tech/fbbot_BE/public/index.php/api/otp/${sender}/${text}`)
            .then(function (response) {
              const data= response.status
              const lee= response.data.status
              console.log(response);
              if( lee === '200' ){
               sendQuickPush(sender)
              }else {
                // sendText(sender,"Wrong OTP. Contact our customer care for assistant")quickReplyOTP()
                quickReplyOTP(sender,"Wrong OTP. Contact our customer care for assistant")
              }
            })
            .catch(function (error) {
              console.log(error);
            });
         }
         else if(message === 'more100'){
           sendText(sender,"Ok. I have sent a Request-To-Pay for KES."+text+" to your phone number. Kindly check your phone.")
           axios.get(`https://nouveta.tech/fbbot_BE/public/index.php/api/push2/${sender}/${text}`)
            .then(function (response) {
              const data= response.status
              console.log(response);
            })
            .catch(function (error) {
              console.log(error);
            });
            axios.get(`https://nouveta.tech/fbbot_BE/public/index.php/api/postmessage/${sender}/paid/${text}`)
             .then(function (response) {
               const data= response.status
               console.log(response);
               axios.get(`https://graph.facebook.com/${sender}?fields=first_name,last_name,profile_pic&access_token=${token}`)
                .then(function (response) {
                  const data= response.status
                  console.log(response);
                  const name = response.data.first_name
                  returnPay(sender,""+name+", your payment has been received. Your new account number is  "+sender+". Can I tell you the services I can help you with?")
                })
                .catch(function (error) {
                  console.log(error);
                });
           })
             .catch(function (error) {
               console.log(error);
             });
         }
         else if(message === "paid"){
            if(text === 'yes'){
              axios.get(`https://graph.facebook.com/${sender}?fields=first_name,last_name,profile_pic&access_token=${token}`)
               .then(function (response) {
                 const data= response.status
                 console.log(response);
                 const name = response.data.first_name
                 menuMain(sender,"Below are the services I can offer you here , "+name+"")
               })
               .catch(function (error) {
                 console.log(error);
               });
            }else if(text === 'no'){
              axios.get(`https://graph.facebook.com/${sender}?fields=first_name,last_name,profile_pic&access_token=${token}`)
               .then(function (response) {
                 const data= response.status
                 console.log(response);
                 const name = response.data.first_name
                 //sendButtonMessage(sender,"Hi "+name+",  I am Kunta and will be your agent today, how may I help you")
                 sendText(sender,"Have a great day "+name+" and hope to hear from you soon, you can always reachout to me here by just typing 'Hi' or call us on 0703088000. And im always here 24/7 to assist you 👋")
               })
               .catch(function (error) {
                 console.log(error);
               });
            }
         }
       })
       .catch(function (error) {
         console.log(error);
       });
    }
  }
// the listening
  app.listen(app.get('port'),function () {
      console.log("running: port");
  });





  // The functions

  function getstarted(sender,text){
    let messageData={
        "text": text,
        "quick_replies":[
          {
          "content_type":"text",
          "title":"Account opening(new customer)",
          "payload":"balance",
          //"image_url":"http://example.com/img/red.png"
          },
          {
          "content_type":"text",
          "title":"service request(returning customer)",
          "payload":"mini",
          //"image_url":"http://example.com/img/red.png"
         },
       {
         "content_type":"text",
         "title":"Enquiries",
         "payload":"book",
         //"image_url":"http://example.com/img/red.png"
       }
     ]
      }
    sendRequest(sender, messageData);
  }

  // the sending messaging_events

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

  //The reply for account openning

  function openAcc(sender , text){
    let messageData={
        "text": text,
        "quick_replies":[
          {
          "content_type":"text",
          "title":"proceed",
          "payload":"proceed",
          //"image_url":"http://example.com/img/red.png"
          },
          {
          "content_type":"text",
          "title":"Not now",
          "payload":"Not now",
          //"image_url":"http://example.com/img/red.png"
         }
          ]
      }
      sendRequest(sender, messageData);
    }

    //The text reply
    function sendText(sender, text){
        let messageData = {text: text};
        sendRequest(sender, messageData)
    }
    // Pull phone number
    function phoneNumber(sender,text){
      let messageData={
          "text": text,
          "quick_replies":[
            {
              "content_type":"user_phone_number"
            },
            {
              "content_type":"text",
              "title":"cancel",
              "payload":"cancel",
            }
          ]
        }
      sendRequest(sender, messageData);
    }
    // the resend otp
    function quickReplyOTP(sender,text){
      let messageData={
          "text": text,
          "quick_replies":[
            {
            "content_type":"text",
            "title":"Resend OTP",
            "payload":"Resend OTP",
            //"image_url":"http://example.com/img/red.png"
            }
       ]
        }
      sendRequest(sender, messageData);
    }
    // The Load
    function sendQuickPush(sender){
      let messageData={
          "text": "Good stuff. We will now need you to deposit at least KES 100 to open and activate your account. Tap on the options below when ready.",
          "quick_replies":[
            {
            "content_type":"text",
            "title":"Load Ksh.100 now",
            "payload":"load Ksh.100 now",
            //"image_url":"http://example.com/img/red.png"
            },
            {
            "content_type":"text",
            "title":"Load more than Ksh.100",
            "payload":"Load more than Ksh.100",
            //"image_url":"http://example.com/img/red.png"
            },
            {
            "content_type":"text",
            "title":"load later",
            "payload":"load later",
            //"image_url":"http://example.com/img/red.png"
            }
            ]
        }
        sendRequest(sender, messageData);
      }
      /* confirm messaging_events*/

      function returnPay(sender,text){
        let messageData={
            "text": text,
            "quick_replies":[
              {
              "content_type":"text",
              "title":"yes",
              "payload":"yes",
              //"image_url":"http://example.com/img/red.png"
              },
              {
              "content_type":"text",
              "title":"no",
              "payload":"no",
              //"image_url":"http://example.com/img/red.png"
              }
              ]
          }
          sendRequest(sender, messageData);
        }

        //he main
        function menuMain(sender,text){
          let messageData={
              "text": text,
              "quick_replies":[
                {
                "content_type":"text",
                "title":"My account",
                "payload":"My account",
                //"image_url":"http://example.com/img/red.png"
                },
                {
                "content_type":"text",
                "title":"My services",
                "payload":"My services",
                //"image_url":"http://example.com/img/red.png"
               },
             {
               "content_type":"text",
               "title":"Enquiries",
               "payload":"Enquiries",
               //"image_url":"http://example.com/img/red.png"
             }
           ]
            }
          sendRequest(sender, messageData);
        }
