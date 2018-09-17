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
  'Tuyến đường xe chạy'
]

<<<<<<< HEAD

// Yêu cầu: làm một hàm phát hiện key như trong mảng ans[]
// - Duyệt qua các ele trong ans và chuỗi s có chứa ele
// trong mảng thì xuất ra 1 câu thông báo 'detect word'
// - Chức năng giống LIKE trong truy vấn CSDL
// vd: 
// 1. "xin cam on" => detect word
// 2. "cam on moi nguoi" => detect word
// Gợi ý: sử dụng 
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




=======
>>>>>>> 5855b6638561db96ff4fcabe90a4fea21c35bb62
// Xử lý khi có người nhắn tin cho bot
app.post('/webhook', function(req, res) {
  var entries = req.body.entry;
  for (var entry of entries) {
    var messaging = entry.messaging;
    for (var message of messaging) {
      var senderId = message.sender.id;
      console.log(message);
      if (message.message) {
        // If user send text
        if (message.message.text) {
<<<<<<< HEAD
          if(detectThanks(message.message.text)){
            sendMessage(senderId,"Cảm ơn bạn đã liên hệ với chúng tôi.");
          }else{
            questionMenu(senderId);
          }
        
=======
          
          console.log(text); // In tin nhắn người dùng
          questionMenu(senderId);
        }
        if(message.postback){
          var text = message.postback.text;
          if( text == arr[0]){
            sendMessage(senderId,"Giá vé lên TP.HCM: 110k, Giá vé lên Bình Dương: 120k");
          }
          if( text == arr[1]){
            sendMessage(senderId," Xe chạy theo tuyến đường Trà Vinh -> Bến Tre -> TP.HCM -> Bình Dương ");
          }
>>>>>>> 5855b6638561db96ff4fcabe90a4fea21c35bb62
        }
      }

      if(message.postback){
          var text = message.postback.title;
          if( text == arr[0]){
            sendMessage(senderId,"Giá vé Trà Vinh -> TP.HCM: 110k, Giá vé Trà Vinh -> Bình Dương: 150k, Đưa rước tận nơi!");
          }
          if( text == arr[1]){
            sendMessage(senderId,"Xe chạy theo tuyến đường Trà Vinh -> Bến Tre -> TP.HCM -> Bình Dương ");
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
      access_token: "EAAaiUzKwmRsBABT7awVDCfMrHx46H2rAbtmN0WazUNhQhUyapK7BY7sSDAUTDgIEMltGanPC05HPMv9X4h0gvix3kcZAnA0E0oYAOBlMKWtHzgS7Fvfw0cqBWxY1ZBQWtcgEZBdihEJtsoP2jnXsbbRQo2hgkQf63PisZBBlPgZDZD",
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
              "payload":"DEVELOPER_DEFINED_PAYLOAD"
            },
            {
              "type":"postback",
              "title":"Tuyến đường xe chạy",
              "payload":"DEVELOPER_DEFINED_PAYLOAD"
<<<<<<< HEAD
            },
            {
            "type":"phone_number",
            "title":"Gọi đặt vé",
            "payload":"+84985303222"
            }
            
            
=======
            }  
>>>>>>> 5855b6638561db96ff4fcabe90a4fea21c35bb62
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
      access_token: "EAAaiUzKwmRsBABT7awVDCfMrHx46H2rAbtmN0WazUNhQhUyapK7BY7sSDAUTDgIEMltGanPC05HPMv9X4h0gvix3kcZAnA0E0oYAOBlMKWtHzgS7Fvfw0cqBWxY1ZBQWtcgEZBdihEJtsoP2jnXsbbRQo2hgkQf63PisZBBlPgZDZD",
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

app.set('port', process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || 3002);
app.set('ip', process.env.OPENSHIFT_NODEJS_IP || process.env.IP || "0.0.0.0");

server.listen(app.get('port'), app.get('ip'), function() {
  console.log("Chat bot server listening at %s:%d ", app.get('ip'), app.get('port'));
});