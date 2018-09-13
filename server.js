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

// Xử lý khi có người nhắn tin cho bot
app.post('/webhook', function(req, res) {
  var entries = req.body.entry;
  for (var entry of entries) {
    var messaging = entry.messaging;
    for (var message of messaging) {
      var senderId = message.sender.id;
      if (message.message) {
        // If user send text
        if (message.message.text) {
          var text = message.message.text;
          console.log(text); // In tin nhắn người dùng
          sendMessage(senderId);
        }
      }
    }
  }

  res.status(200).send("OK");
});


// Gửi thông tin tới REST API để trả lời
function sendMessage(senderId) {
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
              "type":"web_url",
              "url":"https://chatbox-phuochau.herokuapp.com",
              "title":"Giá xe bao nhiêu?"
            },
            {
                "type":"postback",
                "title":"Start Chatting",
                "payload":"DEVELOPER_DEFINED_PAYLOAD"
              }  
          ]
        }
      }
    },
    }
  });
}

app.post('/question', function(req, res) {
  var entries = req.body.entry;
  for (var entry of entries) {
    var messaging = entry.messaging;
    for (var message of messaging) {
      var senderId = message.sender.id;
      if (message.message) {
        // If user send text
        if (message.message.text) {
          var text = message.message.text;
          console.log(text); // In tin nhắn người dùng
          sendMessage(senderId, "Tui là bot đây: " + text);
        }
      }
    }
  }

  res.status(200).send("OK");
});

app.set('port', process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || 3002);
app.set('ip', process.env.OPENSHIFT_NODEJS_IP || process.env.IP || "0.0.0.0");

server.listen(app.get('port'), app.get('ip'), function() {
  console.log("Chat bot server listening at %s:%d ", app.get('ip'), app.get('port'));
});