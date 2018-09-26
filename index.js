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
            console.log("This is me",text);

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

function decideMessage(sender, text1){
    let text = text1.toLowerCase()
    let service = text
     if(text.includes("get started")){
       axios.get(`https://graph.facebook.com/${sender}?fields=first_name,last_name,profile_pic&access_token=${token}`)
        .then(function (response) {
          const data= response.status
          console.log(response);
          const name = response.data.first_name
          sendButtonMessage(sender,"Hi "+name+",  I am Kunta and will be your agent today, how may I help you")
        })
        .catch(function (error) {
          console.log(error);
        });

         //sendText(sender, "Hi, My name is Kunta. I am National Bank of Kenya's assistant. Press the buttons bellow to choose the service you want?")
         //sendButtonMessage(sender,"choose one")

     }else if(text.includes("exists")){
        //sendGenericMessage(sender)
        sendText(sender, "Sorry notice this was your first time here. Kindly provide me with your id Number")
        axios.get(` http://e206f378.ngrok.io/api/postmessage/${sender}/idln/${text}`)
         .then(function (response) {
           const data= response.status
           console.log(response);
         })
         .catch(function (error) {
           console.log(error);
         });
     }
     else if(text.includes("link")){
       axios.get(` http://e206f378.ngrok.io/api/postmessage/${sender}/ID/${text}`)
        .then(function (response) {
          const data= response.status
          console.log(response);
        })
        .catch(function (error) {
          console.log(error);
        });
         sendText(sender,"Enter you phone number beggining with z eg , Z0715428709")
     }
     else if(text.includes("z")){
       axios.get(` http://e206f378.ngrok.io/api/link/${sender}/${text}`)
        .then(function (response) {
          const data= response.status
          console.log(response);
        })
        .catch(function (error) {
          console.log(error);
        });
         sendText(sender,"Message has been sent to your phone")
     }
     else if(text.includes("//")){
       axios.get(` http://e206f378.ngrok.io/api/otp/${sender}/${text}`)
        .then(function (response) {
          const data= response.status
          const lee= response.data.status
          console.log(response);
          console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>',data,lee);
          if( lee === '200' ){
            sendText(sender,"Account successfully linked")
                sendButtonMessage2(sender,"Choose the service youll like to use")
          }else {
             sendText(sender,"Wrong OTP. Contact our customer care for assistant")
          }
        })
        .catch(function (error) {
          console.log(error);
        });
     }
     /*else if(text.includes("load")){
       //sendText(sender,"You can load your account using Mpesa. Enter your phone number below Or if its a different Number enter on the editor")
       quickReply(sender)
     }*/
     else if(text.includes("acc")){
       quickReplyAcc(sender)
     }
     else if(text.includes('check')){
       axios.get(`http://ef36d28f.ngrok.io/api/balance/${sender}`)
        .then(function (response) {
          console.log(response);
          console.log("This is me",phoneNumber);
        })
        .catch(function (error) {
          console.log(error);
        });
       sendText(sender, "Thank the request has been received, Youll receive a text message on your registered number with your acc balance.")
       sendButtonMessage2(sender,"Choose the service youll like to use")
     }
     else if(text.includes("mini")){
       axios.get(`http://ef36d28f.ngrok.io/api/ministatement/${sender}`)
        .then(function (response) {
          console.log(response);
          console.log("This is me",phoneNumber);
        })
        .catch(function (error) {
          console.log(error);
        });
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
       sendButtonCheque(sender,"How many level")
     }
     else if(text.includes("25l")){
       sendText(sender, "Thank you We've received your request once its ready we'll inform you . Thank you")
       sendButtonMessage2(sender,"Choose the service youll like to us to help you")
     }
     else if(text.includes("trans")){
       sendQuickTrans(sender,"Choose the service youll like to use")
     }
     else if(text.includes("deposit")){
       axios.get(`http://ef36d28f.ngrok.io/api/postmessage/${sender}/deposit/null`)
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
     else if(text.includes("//")){
       axios.get(` http://e206f378.ngrok.io/api/postmessage/${sender}/phone/${text}`)
        .then(function (response) {
          const data= response.status
          console.log(response);
        })
        .catch(function (error) {
          console.log(error);
        });
       console.log("I am the number", text);
      let  phoneNumber = text
       sendText(sender,"please enter the amount you will wish to deposit starting with the word X for example X250 to deposit Ksh250")
     }
     else if(text.includes("x")){
       axios.get(` http://e206f378.ngrok.io/api/push/${sender}/amount/${text}`)
        .then(function (response) {
          const data= response.status
          console.log(response);
        })
        .catch(function (error) {
          console.log(error);
        });
       console.log("I am the number", text);
      let  phoneNumber = text
       sendText(sender,"Ypu will recieve a push notification shortly")
       quickReplyAcc(sender)
     }
           else if(text.includes("fer")){
             console.log("im the service",text)
             let service = text
             sendText(sender,"please enter the acount number you will wish to transfer starting with the Bank example NBK123")
             axios.post(` http://e206f378.ngrok.io/api/postmessage/${sender}/tranfer/${text}`)
              .then(function (response) {
                const data= response.status
                console.log(response);
              })
              .catch(function (error) {
                console.log(error);
              });
           }
           else if(service === "NBK"){
             sendText(sender,"you will recieve an OTP on your phonr enter the OTP starting with the word O here to confirm the transaction for example O1234")
             axios.get(` http://e206f378.ngrok.io/api/otp/${sender}`)
              .then(function (response) {
                const data= response.status
                console.log(response);
              })
              .catch(function (error) {
                console.log(error);
              });
           }
           else if(service === "O"){
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
          else if(text.includes("nonexist")){
        //    the yes no for account opening
          sendQuickYes(sender)
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
          sendText(sender,"US DOLLAR	100.7472	100.6472	100.8472,US DOLLAR	100.7472	100.6472	100.8472,US DOLLAR	100.7472	100.6472	100.8472,US DOLLAR	100.7472	100.6472	100.8472")
          sendButtonGen(sender,"This are general services available")
          }
          else if(text.includes("cheque")){
            sendQuickcheq(sender,"Your chequebook is now ordered and can be collected at harambee Avenue, is this convinient for you?")
            axios.get(` http://e206f378.ngrok.io/api/postmessage/${sender}/chequestatus/${text}`)
             .then(function (response) {
               const data= response.status
               console.log(response);
             })
             .catch(function (error) {
               console.log(error);
             });
          }
          else if(text.includes("debit")){
            sendText(sender,"Request received we will contact you when it is ready")
            sendButtonMessage2(sender,"Choose the service youll like to use")
          }
          else if(text.includes("qali")){
            //sendText(sender,"Please enter your ID number starting with the word ID eg ID33865745")
            //the yes no for account opening
          sendQuickYes(sender)
          axios.get(` http://e206f378.ngrok.io/api/postmessage/${sender}/registeryes/${text}`)
           .then(function (response) {
             const data= response.status
             console.log(response);
           })
           .catch(function (error) {
             console.log(error);
           });
          }
          else if(text.includes("///")){
            //sendText(sender,"Please enter your ID number starting with the word ID eg ID33865745")
            //the id Number
             sendText(sender,"Good, there are afew items you will require on hand, Your National ID and make sure your MPESA has atleast Kshs 100.00, cofirm when ready.Enter your ID number starting with the word ID eg ID33865745")

          }
          else if(text.includes("cheque")){
              sendQuickcheq(sender)
          }
          else if(text.includes("debit")){
               sendQuickcheq(sender)
          }
          else if(text.includes("id")){
             axios.get(` http://e206f378.ngrok.io/api/postmessage/${sender}/reg2/${text}`)
              .then(function (response) {
                const data= response.status
                console.log(response);
                sendText(sender,"Gorrit, Enter you phone number beggining with the country code eg 254715428709")
              })
              .catch(function (error) {
                console.log(error);
              });
          }
          else if(text.includes("///n")){
            axios.get(` http://e206f378.ngrok.io/api/register/${sender}/${text}`)
             .then(function (response) {
               const data= response.status
               console.log(response);
             })
             .catch(function (error) {
               console.log(error);
             });
              sendText(sender,"You will receive an OTP on your phone Please enter here to verify your phoneNumber")
          }
          else if(text.includes("//")){
            //to be deleted on production
            axios.get(` http://e206f378.ngrok.io/api/otp/${sender}/${text}`)
             .then(function (response) {
               const data= response.status
               const lee= response.data.status
               console.log(response);
               console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>',data,lee);
               if( lee === '200' ){
                 sendText(sender,"Ok, am sending you a request for a small initail deposit to activate the account")
                 //sleep(10000);
                // sendQuickDep(sender)
                     axios.get(` http://e206f378.ngrok.io/api/push1/${sender}`)
                      .then(function (response) {
                        const data= response.status
                        console.log(response);
                        sendQuickDep(sender)
                      })
                      .catch(function (error) {
                        console.log(error);
                      });
               }else {
                  sendText(sender,"Wrong OTP. Contact our customer care for assistant")
               }
             })
             .catch(function (error) {
               console.log(error);
             });
          }
          else{
              //sendText(sender,text)
              axios.get(` http://e206f378.ngrok.io/api/pastmessage/${sender}`)
               .then(function (response) {
                 const data= response.status
                 console.log(response);
                 const message = response.data.data
                 console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>',message);
                 if( message === 'registeryes'){
                   sendText(sender,"Good, there are afew items you will require on hand, Your National ID and make sure your MPESA has atleast Kshs 100.00, cofirm when ready.Enter your ID number starting with the word ID eg ID33865745")
                 }
                 //reg part 2
                 else if(message === 'reg2'){
                   axios.get(` http://e206f378.ngrok.io/api/register/${sender}/${text}`)
                    .then(function (response) {
                      const data= response.status
                      console.log(response);
                      axios.get(` http://e206f378.ngrok.io/api/postmessage/${sender}/otpreg/${text}`)
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
                    //post the messaging_for OTP
                     sendText(sender,"You will receive an OTP on your phone Please enter here to verify your phoneNumber")
                   }
                   //for the otp confirmation
                   else if(message === 'otpreg'){
                     axios.get(` http://e206f378.ngrok.io/api/otp/${sender}/${text}`)
                      .then(function (response) {
                        const data= response.status
                        const lee= response.data.status
                        console.log(response);
                        console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>',data,lee);
                        if( lee === '200' ){
                          sendText(sender,"Ok, am sending you a request for a small initail deposit to activate the account")
                          //sleep(10000);
                         // sendQuickDep(sender)
                              axios.get(` http://e206f378.ngrok.io/api/push1/${sender}`)
                               .then(function (response) {
                                 const data= response.status
                                 console.log(response);
                                 sendQuickDep(sender)
                               })
                               .catch(function (error) {
                                 console.log(error);
                               });
                        }else {
                           sendText(sender,"Wrong OTP. Contact our customer care for assistant")
                        }
                      })
                      .catch(function (error) {
                        console.log(error);
                      });
                   }
                   else if( message === 'idln'){
                     axios.get(` http://e206f378.ngrok.io/api/postmessage/${sender}/ID/${text}`)
                      .then(function (response) {
                        const data= response.status
                        console.log(response);
                        axios.get(` http://e206f378.ngrok.io/api/postmessage/${sender}/phonelink/${text}`)
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
                       sendText(sender,"Enter you phone number beggining with country code eg , 254715428709")
                   }
                   else if(message === 'phonelink'){
                     axios.get(` http://e206f378.ngrok.io/api/link/${sender}/${text}`)
                      .then(function (response) {
                        const data= response.status
                        console.log(response);
                        axios.get(` http://e206f378.ngrok.io/api/postmessage/${sender}/otplink/${text}`)
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
                       sendText(sender,"OTP has been sent to your phone use to link the account")
                   }
                   else if( message === 'otplink'){
                     axios.get(` http://e206f378.ngrok.io/api/otp/${sender}/${text}`)
                      .then(function (response) {
                        const data= response.status
                        const lee= response.data.status
                        console.log(response);
                        console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>',data,lee);
                        if( lee === '200' ){
                          sendText(sender,"Account successfully linked")
                              sendButtonMessage2(sender,"Choose the service youll like to use")
                        }else {
                           sendText(sender,"Wrong OTP. Contact our customer care for assistant")
                        }
                      })
                      .catch(function (error) {
                        console.log(error);
                      });
                   }
                   else if(message === 'chequestatus'){
                     if( text === 'yes'){
                       axios.get(` http://e206f378.ngrok.io/api/postmessage/${sender}/final/${text}`)
                        .then(function (response) {
                          const data= response.status
                          console.log(response);
                        })
                        .catch(function (error) {
                          console.log(error);
                        });
                        sendQuickcheq(sender,"Anything else you would like my assitance on?")
                     }else {
                       axios.get(` http://e206f378.ngrok.io/api/postmessage/${sender}/chequeLocation/${text}`)
                        .then(function (response) {
                          const data= response.status
                          console.log(response);
                        })
                        .catch(function (error) {
                          console.log(error);
                        });
                        sendText(sender,"Enter the convenient branch you will pick your cheque/debit")
                     }
                   }
                   else if(message === 'chequeLocation'){
                     sendQuickcheq(sender,"Anything else you would like my assitance on?")
                     axios.get(` http://e206f378.ngrok.io/api/postmessage/${sender}/final/${text}`)
                      .then(function (response) {
                        const data= response.status
                        console.log(response);
                      })
                      .catch(function (error) {
                        console.log(error);
                      });
                   }
                   else if(message === 'final'){
                    sendText(sender,"Have a great day and hope to hear from you soon, you can always reachout to me or call us on 0703088000. And im always here 24/7 when you need me just type hi")
                   }

               })
               .catch(function (error) {
                 console.log(error);
               });
                     }

      }
//
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
                        "title":"Join NBK",
                        "payload":"qali"
                    },
                    {
                        "type":"postback",
                        "title":"Enquiry",
                        "payload":"gen"
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
  //send quick transfer
  function sendQuickDep(sender){
    let messageData={
        "text": "We have Chequebooks and Debit Card for your account which if requested can be picked form a branch of your convinience, would you like to order for any of them",
        "quick_replies":[
          {
          "content_type":"text",
          "title":"cheque.",
          "payload":"cheque.",
          //"image_url":"http://example.com/img/red.png"
          },
          {
          "content_type":"text",
          "title":"debit card",
          "payload":"debit card",
          //"image_url":"http://example.com/img/red.png"
         }
          ]
      }
      sendRequest(sender, messageData);
    }
    //Cheque
    function sendQuickcheq(sender,text){
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
      //Debit
      function sendQuickdebit(sender){
        let messageData={
            "text": "Your chequebook is now ordered and can be collected at harambee Avenue, is this convinient for you?",
            "quick_replies":[
              {
              "content_type":"text",
              "title":"Pick there",
              "payload":"pick",
              //"image_url":"http://example.com/img/red.png"
              },
              {
              "content_type":"text",
              "title":"Choose another place",
              "payload":"choose",
              //"image_url":"http://example.com/img/red.png"
             }
              ]
          }
          sendRequest(sender, messageData);
        }
  // Yes or no12
  function sendQuickYes(sender){
    let messageData={
        "text": "Great, welcome to National Bank, is it your first account with us?",
        "quick_replies":[
          {
          "content_type":"text",
          "title":"yes",
          "payload":"yes12",
          //"image_url":"http://example.com/img/red.png"
          },
          {
          "content_type":"text",
          "title":"no",
          "payload":"yes12",
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
