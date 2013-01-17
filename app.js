var connect = require('connect');
var wechat = require('wechat');
var config = require('./config');

var app = connect();
app.use(connect.query());
app.use('/wechat', wechat.connect(config.token, function (req, res, next) {
  res.writeHead(200);
  res.end(wechat.reply({toUsername: 'diaosi', fromUsername: 'nvshen', msgType: 'text', content: '测试中'}));
}));
app.listen(80);
