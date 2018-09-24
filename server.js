// # SimpleServer
// A simple chat bot server
var logger = require('morgan');
var http = require('http');
var bodyParser = require('body-parser');
var express = require('express');
var router = express();

var app = express();
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
var server = http.createServer(app);
var request = require("request");


app.get('/', (req, res) => {
  res.send("Home page. Server running okay.");
});

app.get('/setup',function(req,res){

  getStarted();
  initMenu();
});

// Đây là đoạn code để tạo Webhook
//Ma 337564
app.get('/webhook', function(req, res) {
  if (req.query['hub.verify_token'] === 'tmhsufuijk') {
    res.send(req.query['hub.challenge']);
  }
  res.send('Error, wrong validation token');
});

var arr = [
  'Giá xe bao nhiêu?',
  'Tuyến đường xe chạy',
  'Địa chỉ bãi xe tại TP.HCM',
  'Địa chỉ bãi xe tại Bình Dương',
  'Xe có nhận gửi đồ hay không?'
];

var ACCESS_TOKEN = "EAAQEywipfk8BADgBSBWzE1PepzEoqZCau0qUo47PZCcUu9unjFFrMpB9eZCE1z027pZC8KPppQhNrOYd2A5aJWuwIHsJIZC4PKiM3ZBJmd6YhZCFiONFOk8avzZA2iPTwtsT26VwtzTLKZACiN8ZArpDxtY30s3CVznwoNpupg3Kbk3wZDZD";
var MESSAGE_APP_ID = 263902037430900;

var ans = [
  'cam on',
  'cảm ơn',
  'tks',
]

function detectThanks(s){
  //code here
  var i;
  for (i=0; i < ans.length; i++ ){
    if(s.indexOf(ans[i]) != -1){
      console.log(s.indexOf(ans[i]));
      return true;
    }
  }
  
  return false;
}



// Xử lý khi có người nhắn tin cho bot
app.post('/webhook', function(req, res) {

 let entries = req.body.entry;
  for (let entry of entries) {
    let messaging = entry.messaging;
    for (let message of messaging) {
      let senderId = message.sender.id;
      console.log(message);
      if (message.message) {
        // If user send text
        if (message.message.text) {
          if(detectThanks(message.message.text)){
            sendMessage(senderId,"Cảm ơn bạn đã liên hệ với chúng tôi.");
          }else{
            questionMenu(senderId);
          }
        
        }
        
      }
      if(message.postback){
       
        if( message.postback ){
          var text = message.postback.payload;
          if( text == 'GIA_XE'){
            sendMessage(senderId,"Giá vé Trà Vinh -> TP.HCM: 110k, Giá vé Trà Vinh -> Bình Dương: 150k, Đưa rước tận nơi!");
          }
          if( text == 'TUYEN_DUONG'){
            sendMessage(senderId,"Xe chạy theo tuyến đường Trà Vinh -> Bến Tre -> TP.HCM -> Bình Dương ");
          }
          if( text == 'BAIXE_TPHCM'){
            sendMessage(senderId,"Địa chỉ bãi xe du lịch Phước Hậu tại Bình Dương: 249 Đường số 5 Phường Bình Trị Đông B, Quận Bình Tân");
          }
          if( text == 'BAIXE_BD'){
            sendMessage(senderId,"Địa chỉ bãi xe du lịch Phước Hậu tại Bình Dương: Vòng xoay Phú Mỹ, Thủ Dầu 1, Bình Dương");
          }
          if( text == 'GUIDO'){
            sendMessage(senderId,"Xe có nhận gửi đồ, người nhận hàng đến bãi xe nhận đồ khi được phụ xe gọi ra nhận.");
          }
          if( text === "CHAT_WITH_ADMIN" )
          {
            passThreadControl(senderId);
          }
          if( text === "CHAT_WITH_BOT" )
          {
            takeThreadControl(senderId);
          }
      }
      }

      
    }
  }

  res.status(200).send("OK");
});


// Gửi thông tin tới REST API để trả lời
function questionMenu(senderId) {
  request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: {
      access_token: ACCESS_TOKEN,
    },
    method: 'POST',
    json: {
      recipient: {
        id: senderId
      },
      "message":{
      "attachment":{
        "type":"template",
        "payload":{
          "template_type":"button",
          "text":"Xin chào, bạn muốn hỏi thông tin gì?",
          "buttons":[
            {
              "type":"postback",
              "title":"Giá xe bao nhiêu?",
              "payload":"GIA_XE"
            },
            {
              "type":"postback",
              "title":"Tuyến đường xe chạy",
              "payload":"TUYEN_DUONG"
            },
            {
              "type":"postback",
              "title":"Nói chuyện trực tiếp với admin",
              "payload": "CHAT_WITH_ADMIN"
            }
            
            
          ]
        }
      }
    },
    }
  });
}

// Gửi thông tin tới REST API để trả lời
function sendMessage(senderId, message) {
  request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: {
      access_token: ACCESS_TOKEN,
    },
    method: 'POST',
    json: {
      recipient: {
        id: senderId
      },
      message: {
        text: message
      },
    }
  });
}

//getStarted();
function getStarted(){
  var messageData = {
    "get_started":{
    "payload":"<GET_STARTED_PAYLOAD>"
  }
        };

        // Start the request
        request({
            url: 'https://graph.facebook.com/v2.6/me/messenger_profile',
             qs: {
              access_token: ACCESS_TOKEN,
            },
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            form: messageData
        },
        function (error, response, body) {
            if (!error && response.statusCode == 200) {
                // Print out the response body
                console.log(body);

            } else { 
                
                console.log(body);
            }
        });  
} 
//initMenu();
function initMenu(){
  var messageData = {
    "persistent_menu":[
    {
      "locale":"default",
      "composer_input_disabled":false,
      "call_to_actions":[  
       {  
          "type":"nested",
          "title":"Thông tin về xe",
          "call_to_actions":[  
             {  
                "type":"postback",
                "title":"Giá xe bao nhiêu?",
                "payload":"GIA_XE"
             },
             {  
                "type":"postback",
                "title":"Tuyến đường xe chạy",
                "payload":"TUYEN_DUONG"
             }
          ]
       },
       {  
          "type":"nested",
          "title":"Nói chuyện với",
          "call_to_actions":[  
             {  
                "type":"postback",
                "title":"Admin",
                "payload":"CHAT_WITH_ADMIN"
             },
             {  
                "type":"postback",
                "title":"Trả lời tự động",
                "payload":"CHAT_WITH_BOT"
             }
          ]
       },
       {  
          "type":"nested",
          "title":"Địa chỉ bãi xe",
          "call_to_actions":[  
             {  
                "type":"postback",
                "title":"tại TP.HCM",
                "payload":"BAIXE_TPHCM"
             },
             {  
                "type":"postback",
                "title":"tại Bình Dương",
                "payload":"BAIXE_BD"
             },
    
          ]
       }
    ] 
    }]
    };

        // Start the request
    request({
    uri: 'https://graph.facebook.com/v2.6/me/messenger_profile',
    qs: { 
      access_token: ACCESS_TOKEN 
    },
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    form: messageData
    },
    function (error, response, body) {
      if (!error && response.statusCode == 200) {
        // Print out the response body
        console.error(body);
      } else { 
        console.error(body);
      }
    });
  } 






function passThreadControl(senderId) {
    request(
        {
            uri: "https://graph.facebook.com/v2.6/me/pass_thread_control",
            qs: { access_token: ACCESS_TOKEN }, // access token of your app (bot server) to your page
            method: "POST",
            json: {
                recipient: {
                    id: senderId
                },
                target_app_id: MESSAGE_APP_ID // you can retrieve this in your page setting after linking zendesk message - 200646160103180
            }
        },
        (err, res, body) => {
            if (err || body.error) {
                console.log("UNABLE TO SEND PASS THREAD REQUEST", err || body.error);
            } else {
                sendMessage(senderId,"Bạn đang nói chuyện với admin");
                console.log("PASSED THREAD TO MESSAGE DASHBOARD BOT");
            }
        }
    );
}


function takeThreadControl(senderId) {
    request(
        {
            uri: "https://graph.facebook.com/v2.6/me/take_thread_control",
            qs: { access_token: ACCESS_TOKEN }, // access token of your app (bot server) to your page
            method: "POST",
            json: {
                recipient: {
                    id: senderId
                },
                metadata:"String to pass to the secondary receiver" 
            }
        },
        (err, res, body) => {
            if (err || body.error) {
                console.log("UNABLE TO SEND PASS THREAD REQUEST", err || body.error);
            } else {
                sendMessage(senderId,"Bạn đang nói chuyện với hệ thống trả lời tự động!");
                console.log("TAKED THREAD TO MESSAGE DASHBOARD BOT");
            }
        }
    );
}

app.set('port', process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || 3002);
app.set('ip', process.env.OPENSHIFT_NODEJS_IP || process.env.IP || "0.0.0.0");

server.listen(app.get('port'), app.get('ip'), function() {
  console.log("Chat bot server listening at %s:%d ", app.get('ip'), app.get('port'));
});