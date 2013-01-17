var connect = require('connect');
var wechat = require('wechat');
var config = require('./config');

var app = connect();
app.use(connect.query());
app.use('/wechat', wechat.connect(config.token, function (req, res, next) {
  res.reply({msgType: 'text', content: '测试中'});
}));
app.use('/', function (req, res) {
  res.writeHead(200);
  res.end('hello node api');
});
app.listen(80);
