var connect = require('connect');
var wechat = require('wechat');
var config = require('./config');
var index = require('./index');

var app = connect();
app.use(connect.query());
app.use('/wechat', wechat(config.token, function (req, res, next) {
  var data = index.search(req.weixin.Content);
  var content = '';
  switch (data.status) {
    case 'MATCHED':
      content = data.status;
    break;
    case 'UNMATCHED':
    default:
    break;
  }
  content = data.status;
  res.reply({msgType: 'text', content: content});
}));
app.use('/', function (req, res) {
  res.writeHead(200);
  res.end('hello node api');
});

var port = process.env.VCAP_APP_PORT || 3000;
app.listen(port);
