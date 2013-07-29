var express = require("express");
var request = require("superagent");
var app = express();
app.use(express.logger());

app.get('/', function(req, res) {
  var options = {};
	if(typeof req.query.type === 'undefined') {
    res.send({error: 'You have to specify a type of stats (type=facebook,type=twitter)'});
    return;
	}
  options.type = req.query.type;
  if(typeof req.query.url !== 'undefined') {
    options.url = req.query.url;
  } else {
    options.url = req.header('Referer');
  }
  switch(options.type) {
    case 'facebook':
      callFB(options, req, res);
      break;
    default:
      res.send({error: 'Invalid type'});
      
  }
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});

var callFB = function(options, req, res){
  var apiUrl = "https://graph.facebook.com/fql?q=SELECT%20url,%20normalized_url,%20share_count,%20like_count,%20comment_count,%20total_count,commentsbox_count,%20comments_fbid,%20click_count%20FROM%20link_stat%20WHERE%20url='"+options.url+"'";
  request.get(apiUrl)
          .set('Accept', 'application/json')
          .end(function(data){
            console.log(data);
            res.send(data.body);
          });
}