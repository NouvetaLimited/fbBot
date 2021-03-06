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

function decideMessage(sender, text1){
    let text = text1.toLowerCase()
    let service = text
     if(text.includes("get started")){
       axios.get(`https://graph.facebook.com/${sender}?fields=first_name,last_name,profile_pic&access_token=${token}`)
        .then(function (response) {
          const data= response.status
          console.log(response);
          const name = response.data.first_name
          sendButtonMessage(sender,"Hi "+name+",☺ I am Kunta and will be your agent today, how may I help you?")
          //quickReplyAcc(sender,"I am Kunta and will be your agent today, how may I help you?")
        })
        .catch(function (error) {
          console.log(error);
        });
        //sendText(sender, "Hi, My name is Kunta. I am National Bank of Kenya's assistant. Press the buttons bellow to choose the service you want?")
         //sendButtonMessage(sender,"choose one")
     }
    else if(text === 'hi'){
       axios.get(`https://graph.facebook.com/${sender}?fields=first_name,last_name,profile_pic&access_token=${token}`)
        .then(function (response) {
          const data= response.status
          console.log(response);
          const name = response.data.first_name
          sendButtonMessage(sender,"Hi "+name+",☺ I am Kunta and will be your agent today, how may I help you?")
          //quickReplyAcc(sender,"I am Kunta and will be your agent today, how may I help you?")
        })
        .catch(function (error) {
          console.log(error);
        });
     }
     else if(text.includes("exists")){
        //sendGenericMessage(sender)
        sendText(sender, "😞Sorry notice this was your first time here. Kindly provide me with your id Number")
        axios.get(`https://nouveta.tech/fbbot_BE/public/index.php/api/postmessage/${sender}/idln/${text}`)
         .then(function (response) {
           const data= response.status
           console.log(response);
         })
         .catch(function (error) {
           console.log(error);
         });
     }
     else if(text.includes("link")){
       axios.get(`https://nouveta.tech/fbbot_BE/public/index.php/api/postmessage/${sender}/ID/${text}`)
        .then(function (response) {
          const data= response.status
          console.log(response);
        })
        .catch(function (error) {
          console.log(error);
        });
         sendText(sender,"Enter you phone number beggining with z eg , Z0715428709")
     }
     else if(text.includes("z211")){
       axios.get(`https://nouveta.tech/fbbot_BE/public/index.php/api/link/${sender}/${text}`)
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
       axios.get(`https://nouveta.tech/fbbot_BE/public/index.php/api/otp/${sender}/${text}`)
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
       quickReplyAcc1(sender)
     }
     else if(text.includes('check')){
       axios.get(`https://nouveta.tech/fbbot_BE/public/index.php/api/postmessage/${sender}/balance/${text}`)
        .then(function (response) {
          const data= response.status
          console.log(response);
        })
        .catch(function (error) {
          console.log(error);
        });
        sendQuickbal(sender,'No problem, but first i need to confirm your details  kindly provide me with the following \n 1.Your National ID')
       /*axios.get(`https://nouveta.tech/fbbot_BE/public/index.php/api/balance/${sender}`)
        .then(function (response) {
          console.log(response);
          //console.log("This is me",phoneNumber);
        })
        .catch(function (error) {
          console.log(error);
        });
       sendText(sender, "Thank the request has been received, Youll receive a text message on your registered number with your acc balance.")
       //sendButtonMessage2(sender,"Choose the service youll like to use")
       sendQuickcheq(sender,"Anything else you would like my assitance on?")
       axios.get(`https://nouveta.tech/fbbot_BE/public/index.php/api/postmessage/${sender}/final/${text}`)
        .then(function (response) {
          const data= response.status
          console.log(response);
        })
        .catch(function (error) {
          console.log(error);
        });*/
     }
     else if(text.includes("okay")){
       axios.get(`https://nouveta.tech/fbbot_BE/public/index.php/api/postmessage/${sender}/balanceco/${text}`)
        .then(function (response) {
          const data= response.status
          console.log(response);
        })
        .catch(function (error) {
          console.log(error);
        });
        sendText(sender,"Kindly provide me with your id number")
     }
     else if(text.includes("mini")){
       sendText(sender,"Please choose the Account you would want to check the balance \n 1 acc 543*******325\n 2 acc 543***********125")
       axios.get(`https://nouveta.tech/fbbot_BE/public/index.php/api/postmessage/${sender}/mini1/${text}`)
        .then(function (response) {
          const data= response.status
          console.log(response);
        })
        .catch(function (error) {
          console.log(error);
        });
     }
     else if(text.includes("statement")){
       sendButtonStatement(sender,"Do you want a")
     }
     else if(text.includes("hard")){
       sendText(sender, "We've received your request we will contact you once its ready. Thank you")

       //sendButtonMessage2(sender,"Choose the service youll like to use")
       axios.get(`https://nouveta.tech/fbbot_BE/public/index.php/api/postmessage/${sender}/final/${text}`)
        .then(function (response) {
          const data= response.status
          console.log(response);
          sendQuickcheq(sender,"Anything else you would like my assitance on?")
        })
        .catch(function (error) {
          console.log(error);
        });
     }
     else if(text.includes("soft")){
       sendText(sender, "You will receive your statement on your email registered to us")
       //sendButtonMessage2(sender,"Choose the service youll like to use")
       sendQuickcheq(sender,"Anything else you would like my assitance on?")
       axios.get(`https://nouveta.tech/fbbot_BE/public/index.php/api/postmessage/${sender}/final/${text}`)
        .then(function (response) {
          const data= response.status
          console.log(response);
        })
        .catch(function (error) {
          console.log(error);
        });
     }
     else if(text.includes("book")){
       sendButtonCheque(sender,"How many level")
     }
     else if(text.includes("25l")){
       sendText(sender, "Thank you We've received your request once its ready we'll inform you . Thank you")
       //sendButtonMessage2(sender,"Choose the service youll like to us to help you")
       sendQuickcheq(sender,"Anything else you would like my assitance on?")
       axios.get(`https://nouveta.tech/fbbot_BE/public/index.php/api/postmessage/${sender}/final/${text}`)
        .then(function (response) {
          const data= response.status
          console.log(response);
        })
        .catch(function (error) {
          console.log(error);
        });
     }
     else if(text.includes("trans")){
       sendQuickTrans(sender,"Choose the service youll like to use")
     }
     else if(text.includes("pay")){
       quickReplyPay(sender)
       axios.get(`https://nouveta.tech/fbbot_BE/public/index.php/api/postmessage/${sender}/deposit/${text}`)
        .then(function (response) {
          console.log(response);
          console.log("This is me",phoneNumber);
        })
        .catch(function (error) {
          console.log(error);
        });
     }
     else if(text.includes("//")){
       axios.get(`https://nouveta.tech/fbbot_BE/public/index.php/api/postmessage/${sender}/deposit/${text}`)
        .then(function (response) {
          console.log(response);
          console.log("This is me",phoneNumber);
        })
        .catch(function (error) {
          console.log(error);
        });
        quickReply(sender)
     }
     else if(text.includes("deposit")){
       axios.get(`https://nouveta.tech/fbbot_BE/public/index.php/api/postmessage/${sender}/deposit/${text}`)
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
       axios.get(`https://nouveta.tech/fbbot_BE/public/index.php/api/postmessage/${sender}/phone/${text}`)
        .then(function (response) {
          const data= response.status
          console.log(response);
        })
        .catch(function (error) {
          console.log(error);
        });
       console.log("I am the number", text);
      let  phoneNumber = text
       sendText(sender,"please enter the amount you will wish to deposit starting with the word X for example 250 to deposit Ksh250")
     }
     else if(text.includes("//")){
       axios.get(`https://nouveta.tech/fbbot_BE/public/index.php/api/push/${sender}/amount/${text}`)
        .then(function (response) {
          const data= response.status
          console.log(response);
        })
        .catch(function (error) {
          console.log(error);
        });
       console.log("I am the number", text);
      let  phoneNumber = text
       sendText(sender,"You will recieve a push notification shortly")
       quickReplyAcc(sender)
     }
           else if(text.includes("fer")){
             console.log("im the service",text)
             let service = text
             sendText(sender,"please enter the acount number you will wish to transfer starting with the Bank example NBK123")
             axios.get(`https://nouveta.tech/fbbot_BE/public/index.php/api/postmessage/${sender}/tranfer/${text}`)
              .then(function (response) {
                const data= response.status
                console.log(response);
              })
              .catch(function (error) {
                console.log(error);
              });
           }
           else if(service === "NBK"){
             sendText(sender,"you will recieve an OTP on your phone enter the OTP starting with the word O here to confirm the transaction for example O1234")
             axios.get(`https://nouveta.tech/fbbot_BE/public/index.php/api/otp/${sender}`)
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
            //let service = "loc"
            axios.get(`https://nouveta.tech/fbbot_BE/public/index.php/api/postmessage/${sender}/location/${text}`)
             .then(function (response) {
               const data= response.status
               console.log(response);
               quickReplyLoc(sender)
             })
             .catch(function (error) {
               console.log(error);
             });

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
          sendText(sender,"US DOLLAR	100.7472	100.6472	100.8472\n,US DOLLAR	100.7472	100.6472	100.8472\n,US DOLLAR	100.7472	100.6472	100.8472\n,US DOLLAR	100.7472	100.6472	100.8472")
          sendButtonGen(sender,"This are general services available")
          }
          else if(text.includes("cheque")){
            sendQuickcheq(sender,"Your chequebook is now ordered and can be collected at harambee Avenue, is this convinient for you?")
            axios.get(`https://nouveta.tech/fbbot_BE/public/index.php/api/postmessage/${sender}/chequestatus/${text}`)
             .then(function (response) {
               const data= response.status
               console.log(response);
             })
             .catch(function (error) {
               console.log(error);
             });
          }
          else if(text.includes("debit")){
            //sendText(sender,"Request received we will contact you when it is ready")
            //sendButtonMessage2(sender,"Choose the service youll like to use")
            sendQuickdebit(sender)
            axios.get(`https://nouveta.tech/fbbot_BE/public/index.php/api/postmessage/${sender}/email/${text}`)
             .then(function (response) {
               const data= response.status
               console.log(response);
             })
             .catch(function (error) {
               console.log(error);
             });
          }
          else if(text.includes("not now")){
            sendQuickcheq(sender,"Anything else you would like my assitance on?")
            axios.get(`https://nouveta.tech/fbbot_BE/public/index.php/api/postmessage/${sender}/final/${text}`)
             .then(function (response) {
               const data= response.status
               console.log(response);
             })
             .catch(function (error) {
               console.log(error);
             });
          }
          else if(text.includes("qali")){
            //sendText(sender,"Please enter your ID number starting with the word ID eg ID33865745")
            //the yes no for account opening
          //sendQuickYes(sender)
        //  sendText(sender,"Great welcome to national bank")

          sendQuickRead(sender , "Great welcome to national bank, there are afew items you will require on hand, Your National ID and make sure your MPESA has atleast Kshs 100.00, cofirm when ready ")
          }
          else if(text.includes("cancel")){
            sendButtonMessage2(sender,"Process cancelled \n Choose the service youll like to use")
          }
          else if(text.includes("ready")){
            sendText(sender,"Enter your ID number eg 33865745")
            axios.get(`https://nouveta.tech/fbbot_BE/public/index.php/api/postmessage/${sender}/idreg/${text}`)
             .then(function (response) {
               const data= response.status
               console.log(response);
             })
             .catch(function (error) {
               console.log(error);
             });
          }
          else if(text.includes('i dont mind')){
            sendQuickDep(sender,"We have Chequebooks and Debit card for your account which if requested cn be picked from a branch of your convinience would you like to order for any of them")
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
          else if(text.includes("//")){
             axios.get(`https://nouveta.tech/fbbot_BE/public/index.php/api/postmessage/${sender}/reg2/${text}`)
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
            axios.get(`https://nouveta.tech/fbbot_BE/public/index.php/api/register/${sender}/${text}`)
             .then(function (response) {
               const data= response.status
               console.log(response);
             })
             .catch(function (error) {
               console.log(error);
             });
              sendText(sender,"You will receive an OTP on your phone Please enter here to verify your phoneNumber")
          }
          else if(text.includes("hi kunta")){
            axios.get(`https://graph.facebook.com/${sender}?fields=first_name,last_name,profile_pic&access_token=${token}`)
             .then(function (response) {
               const data= response.status
               console.log(response);
               const name = response.data.first_name
               sendText(sender,"Hi "+name+",  Welcome back.")
               sendButtonMessage2(sender,"This is are ways I can help you")
             })
             .catch(function (error) {
               console.log(error);
             });
          }
          else if(text.includes("load ksh.100 now")){
            sendText(sender,"You will receive an STK push enter you mpesa pin and proceed")
            axios.get(`https://nouveta.tech/fbbot_BE/public/index.php/api/push1/${sender}`)
             .then(function (response) {
               const data= response.status
               sendQuickDep(sender)
               console.log(response);
             })
             .catch(function (error) {
               console.log(error);
             });
          }
          else if(text.includes("load more than")){
            sendText(sender,"Enter the amount you want to deposit")
            axios.get(`https://nouveta.tech/fbbot_BE/public/index.php/api/postmessage/${sender}/more100/${text}`)
             .then(function (response) {
               const data= response.status
               console.log(response);
           })
             .catch(function (error) {
               console.log(error);
             });
          }
          else if(text.includes("load later")){
             sendQuickDep(sender)
          }
          else if(text.includes("//")){
            //to be deleted on production
            axios.get(`https://nouveta.tech/fbbot_BE/public/index.php/api/otp/${sender}/${text}`)
             .then(function (response) {
               const data= response.status
               const lee= response.data.status
               console.log(response);
               console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>',data,lee);
               if( lee === '200' ){
                 sendText(sender,"Ok, am sending you a request for a small initail deposit to activate the account")
                 //sleep(10000);
                // sendQuickDep(sender)
                     axios.get(`https://nouveta.tech/fbbot_BE/public/index.php/api/push1/${sender}`)
                      .then(function (response) {
                        const data= response.status
                        console.log(response);
                        //sendQuickDep(sender)
                        //sendQuickcheq(sender,"I have confirmed your details,And your account number has been sent to your phone, do you mind if I took you through some of our products that you may find useful?")
                        sendQuickmind(sender)
                        axios.get(`https://nouveta.tech/fbbot_BE/public/index.php/api/postmessage/${sender}/reg3/${text}`)
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
              axios.get(`https://nouveta.tech/fbbot_BE/public/index.php/api/pastmessage/${sender}`)
               .then(function (response) {
                 const data= response.status
                 console.log(response);
                 const message = response.data.data
                 console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>',message);
                 if( message === 'registeryes'){
                   sendText(sender,"Good, there are afew items you will require on hand, Your National ID and make sure your MPESA has atleast Kshs 100.00, cofirm when ready.Enter your ID number starting with the word ID eg ID33865745")
                 }
                 //reg part 2
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
                    //post the messaging_for OTP
                    // sendText(sender,"You will receive an OTP on your phone. Please enter the OTP here to verify your phoneNumber")
                     quickReplyOTP(sender,"You will receive an OTP on your phone. Please enter the OTP here to verify your phoneNumber")
                   }
                   //for the otp confirmation
                   else if(message === 'otpreg'){
                     axios.get(`https://nouveta.tech/fbbot_BE/public/index.php/api/otp/${sender}/${text}`)
                      .then(function (response) {
                        const data= response.status
                        const lee= response.data.status
                        console.log(response);
                        console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>',data,lee);
                        if( lee === '200' ){
                          //sendText(sender,"We have confirmed your number, am sending you a request for a small initail deposit of Ksh.100 to activate the account.")
                          //sleep(10000);
                         // sendQuickDep(sender)
                         //sendQuickmind(sender)
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
                   else if( message === 'idln'){
                     axios.get(`https://nouveta.tech/fbbot_BE/public/index.php/api/postmessage/${sender}/ID/${text}`)
                      .then(function (response) {
                        const data= response.status
                        console.log(response);
                        axios.get(`https://nouveta.tech/fbbot_BE/public/index.php/api/postmessage/${sender}/phonelink/${text}`)
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
                   else if(message === 'mini1'){
                     axios.get(`https://nouveta.tech/fbbot_BE/public/index.php/api/ministatement/${sender}`)
                      .then(function (response) {
                        console.log(response);
                        const number = response.data.data
                        let str = number.replace(/\d(?=\d{4})/g, "*");
                        sendQuickcheq(sender,"Your ministatement as been sent to your phone "+str+" .Anything else you would like my assitance on?")
                      })
                      .catch(function (error) {
                        console.log(error);
                      });
                      //console.log('............................................................',number);
                      // sendText(sender, "Thank the request has been received, Youll receive a text message on your phone."+str+"")

                     axios.get(`https://nouveta.tech/fbbot_BE/public/index.php/api/postmessage/${sender}/final/${text}`)
                      .then(function (response) {
                        const data= response.status
                        console.log(response);
                      })
                      .catch(function (error) {
                        console.log(error);
                      });
                   }
                   else if(message === 'phonelink'){
                     axios.get(`https://nouveta.tech/fbbot_BE/public/index.php/api/link/${sender}/${text}`)
                      .then(function (response) {
                        const data= response.status
                        console.log(response);
                        axios.get(`https://nouveta.tech/fbbot_BE/public/index.php/api/postmessage/${sender}/otplink/${text}`)
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
                     axios.get(`https://nouveta.tech/fbbot_BE/public/index.php/api/otp/${sender}/${text}`)
                      .then(function (response) {
                        const data= response.status
                        const lee= response.data.status
                        console.log(response);
                        console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>',data,lee);
                        if( lee === '200' ){
                          sendText(sender,"Two accounts \n 1. 121454*******25. \n2. 35422**************32. \n have been linked to this facebook account")
                          axios.get(`https://graph.facebook.com/${sender}?fields=first_name,last_name,profile_pic&access_token=${token}`)
                           .then(function (response) {
                             const data= response.status
                             console.log(response);
                             const name = response.data.first_name
                             //sendText(sender,"Hi "+name+",  Welcome back.")
                             sendButtonMessage2(sender,"This are ways I can help you")
                           })
                           .catch(function (error) {
                             console.log(error);
                           });
                              // sendButtonMessage2(sender,"Here are services available")
                        }else {
                           sendText(sender,"Wrong OTP. Contact our customer care for assistant")
                        }
                      })
                      .catch(function (error) {
                        console.log(error);
                      });
                   }
                   else if( message === 'balanceco1'){
                     axios.get(`https://nouveta.tech/fbbot_BE/public/index.php/api/balance/${sender}`)
                      .then(function (response) {
                        console.log(response);
                        //console.log("This is me",phoneNumber);
                        const number = response.data.phone
                        let str = number.replace(/\d(?=\d{4})/g, "*");
                        //console.log('............................................................',number);
                        // sendText(sender, "Thank the request has been received, Youll receive a text message on your phone."+str+"")
                        sendQuickcheq(sender,"Your balance as been sent to your phone "+str+" .Anything else you would like my assitance on?")
                      })
                      .catch(function (error) {
                        console.log(error);
                      });
                     //sendButtonMessage2(sender,"Choose the service youll like to use")
                     axios.get(`https://nouveta.tech/fbbot_BE/public/index.php/api/postmessage/${sender}/final/${text}`)
                      .then(function (response) {
                        const data= response.status
                        console.log(response);

                      })
                      .catch(function (error) {
                        console.log(error);
                      });
                   }
                   else if(message === 'balanceco'){
                     axios.get(`https://nouveta.tech/fbbot_BE/public/index.php/api/postmessage/${sender}/balanceco1/${text}`)
                      .then(function (response) {
                        const data= response.status
                        console.log(response);
                      })
                      .catch(function (error) {
                        console.log(error);
                      });
                      sendText(sender,"Please choose the Account you would want to check the balance \n 1 acc 543*******325\n 2 acc 543***********125")
                   }
                   else if(message === 'chequestatus'){
                     if( text === 'yes'){
                       axios.get(`https://nouveta.tech/fbbot_BE/public/index.php/api/postmessage/${sender}/final/${text}`)
                        .then(function (response) {
                          const data= response.status
                          console.log(response);
                        })
                        .catch(function (error) {
                          console.log(error);
                        });
                        sendQuickcheq(sender,"Anything else you would like my assitance on?")
                     }else {
                       axios.get(`https://nouveta.tech/fbbot_BE/public/index.php/api/postmessage/${sender}/chequeLocation/${text}`)
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
                     axios.get(`https://nouveta.tech/fbbot_BE/public/index.php/api/postmessage/${sender}/final/${text}`)
                      .then(function (response) {
                        const data= response.status
                        console.log(response);
                      })
                      .catch(function (error) {
                        console.log(error);
                      });
                   }
                   else if(message === 'final'){
                     if(text === 'yes'){
                       sendButtonMessage2(sender,"Here are services available for you")
                     }else{
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
                   else if(message === 'email'){
                     if(text === 'yes'){
                       sendText(sender,"Enter your email")
                       axios.get(`https://nouveta.tech/fbbot_BE/public/index.php/api/postmessage/${sender}/emailfinal/${text}`)
                        .then(function (response) {
                          const data= response.status
                          console.log(response);
                        })
                        .catch(function (error) {
                          console.log(error);
                        });
                     }else{
                       sendQuickcheq(sender,"Anything else you would like my assitance on?")
                       axios.get(`https://nouveta.tech/fbbot_BE/public/index.php/api/postmessage/${sender}/final/${text}`)
                        .then(function (response) {
                          const data= response.status
                          console.log(response);
                        })
                        .catch(function (error) {
                          console.log(error);
                        });
                     }
                   }
                   else if(message === 'emailfinal'){
                     sendQuickcheq(sender,"Anything else you would like my assitance on?")
                     axios.get(`https://nouveta.tech/fbbot_BE/public/index.php/api/postmessage/${sender}/final/${text}`)
                      .then(function (response) {
                        const data= response.status
                        console.log(response);
                      })
                      .catch(function (error) {
                        console.log(error);
                      });
                   }
                   else if(message === 'reg3'){
                     if (text === 'yes'){
                        sendQuickDep(sender)
                     }else {
                       sendQuickcheq(sender,"Anything else you would like my assitance on?")
                       axios.get(`https://nouveta.tech/fbbot_BE/public/index.php/api/postmessage/${sender}/final/${text}`)
                        .then(function (response) {
                          const data= response.status
                          console.log(response);
                        })
                        .catch(function (error) {
                          console.log(error);
                        });
                     }
                   }
                   else if(message === 'deposit'){
                     axios.get(`https://nouveta.tech/fbbot_BE/public/index.php/api/postmessage/${sender}/phone/${text}`)
                      .then(function (response) {
                        const data= response.status
                        console.log(response);
                      })
                      .catch(function (error) {
                        console.log(error);
                      });
                   }
                   else if(message === 'amountdepo'){
                     axios.get(`https://nouveta.tech/fbbot_BE/public/index.php/api/push/${sender}/amount/${text}`)
                      .then(function (response) {
                        const data= response.status
                        console.log(response);
                         sleep(2000);
                        axios.get(`https://nouveta.tech/fbbot_BE/public/index.php/api/postmessage/${sender}/final/${text}`)
                         .then(function (response) {
                           const data= response.status
                           console.log(response);
                           sendQuickcheq(sender,"Anything else you would like my assitance on?")
                         })
                         .catch(function (error) {
                           console.log(error);
                         });
                      })
                      .catch(function (error) {
                        console.log(error);
                      });
                     console.log("I am the number", text);
                    let  phoneNumber = text
                     sendText(sender,"You will recieve a push notification shortly")
                   }
                   else if(message === 'more100'){
                     axios.get(`https://nouveta.tech/fbbot_BE/public/index.php/api/push2/${sender}/${text}`)
                      .then(function (response) {
                        const data= response.status
                        console.log(response);
                        axios.get(`https://nouveta.tech/fbbot_BE/public/index.php/api/postmessage/${sender}/final/${text}`)
                         .then(function (response) {
                           const data= response.status
                           console.log(response);
                           sendQuickcheq(sender,"Anything else you would like my assitance on?")
                         })
                         .catch(function (error) {
                           console.log(error);
                         });
                      })
                      .catch(function (error) {
                        console.log(error);
                      });
                     console.log("I am the number", text);
                    let  phoneNumber = text
                     sendText(sender,"You will recieve a push notification shortly")
                   }
                   else if(message === 'location'){
                     sendText(sender,"The nearest branch to you is Harambee Avenue and it's operating time is betweem 8:30am and 4:30pm on weekdays and 8:30am to 12:30pm on weekends, but we are closed on Sundays and all national public holidays, Is there any enquiry you wish to make")
                     axios.get(`https://nouveta.tech/fbbot_BE/public/index.php/api/postmessage/${sender}/final/${text}`)
                      .then(function (response) {
                        const data= response.status
                        console.log(response);
                        sendQuickcheq(sender,"Anything else you would like my assitance on?")
                      })
                      .catch(function (error) {
                        console.log(error);
                      });
                   }
                   else if(message === 'idreg'){
                     axios.get(`https://nouveta.tech/fbbot_BE/public/index.php/api/postmessage/${sender}/reg2/${text}`)
                      .then(function (response) {
                        const data= response.status
                        console.log(response);
                        sendText(sender,"Gorrit, Enter you phone number beggining with the country code eg 254715428709")
                      })
                      .catch(function (error) {
                        console.log(error);
                      });
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
                        "title":"Account openning(newCustomer)",
                        "payload":"qali"
                    },
                    {
                        "type":"postback",
                        "title":"service Request (returning customer)",
                        "payload":"exists"
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
        {
          "content_type":"text",
          "title":"cancel",
          "payload":"cancel",
        }
      ]
    }
  sendRequest(sender, messageData);
}
/**
location
*/
function quickReplyLoc(sender){
  let messageData={
      "text": "Please click on the button below and share your location or type on the text field",
      "quick_replies":[
        {
          "content_type":"location"
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
/**
Account
*/
function quickReplyAcc1(sender){
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
//first encounter

function quickReplyAcc(sender,text){
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
//OTP not sendText
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
/**
quick reply PayB
*/
function quickReplyPay(sender){
  let messageData={
      "text": "Select your response swipe left for more replies",
      "quick_replies":[
        {
        "content_type":"text",
        "title":"Nairobi water services",
        "payload":"water",
        //"image_url":"http://example.com/img/red.png"
        },
        {
        "content_type":"text",
        "title":"buy airtime services",
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
       "title":"Other services",
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
  //ready
  function sendQuickRead(sender , text){
    let messageData={
        "text": text,
        "quick_replies":[
          {
          "content_type":"text",
          "title":"ready",
          "payload":"ready",
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
  //send quick transfer
  function sendQuickDep(sender){
    let messageData={
        "text": "We also have Chequebooks and Debit Card for your account which if requested can be picked form a branch of your convinience, would you like to order for any of them",
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
          },
          {
          "content_type":"text",
          "title":"not now",
          "payload":"not now",
          //"image_url":"http://example.com/img/red.png"
          }
          ]
      }
      sendRequest(sender, messageData);
    }
    //do you mind
    function sendQuickmind(sender){
      let messageData={
          "text": "Do you mind if i took you through some of our product that you may find useful",
          "quick_replies":[
            {
            "content_type":"text",
            "title":"I dont mind",
            "payload":"I dont mind",
            //"image_url":"http://example.com/img/red.png"
            },
            {
            "content_type":"text",
            "title":"not now",
            "payload":"not now",
            //"image_url":"http://example.com/img/red.png"
            }
            ]
        }
        sendRequest(sender, messageData);
      }
      //push
      function sendQuickPush(sender){
        let messageData={
            "text": "I have confirmed your details, Your new acount is: "+sender+", to activate your account you are required to make an initial deposit of atlist 100",
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
      //balance
      function sendQuickbal(sender,text){
        let messageData={
            "text": text,
            "quick_replies":[
              {
              "content_type":"text",
              "title":"okay",
              "payload":"okay",
              //"image_url":"http://example.com/img/red.png"
              },
              {
              "content_type":"text",
              "title":"not now",
              "payload":"not now",
              //"image_url":"http://example.com/img/red.png"
             }
              ]
          }
          sendRequest(sender, messageData);
        }
      //Debit
      function sendQuickdebit(sender){
        let messageData={
            "text": "I have placed an order for you and you can can collect it from Harambee avenue in three days.Would you like me to remind you",
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
function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}
