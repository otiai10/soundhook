
/**
 * Module dependencies.
 */
var express = require('express');
var routes  = require('./routes');
var api     = require('./routes/api.js');
var conf    = require('./my_modules/conf').getConf();

var port    = conf.serv_port;

var app = module.exports = express.createServer();

// Configuration --------------------------------------
app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.bodyParser());
  app.use(express.cookieParser());
  //app.use(express.cookieDecoder());
  app.use(express.session({secret:'secret'}));
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});
app.configure('production', function(){
  app.use(express.errorHandler());
});

app.dynamicHelpers({
    session: function(req, res) {
        return req.session;
    }
});

// Routes
app.get('/',                                       routes.index);
app.post('/',                                    routes.prepare);
app.get('/auth/twitter',                   routes.oauth_twitter);
app.get('/auth/twitter/callback', routes.oauth_twitter_callback);
app.get('/signout',                              routes.signout);
app.get('/privacypolicy',                 routes.privacy_policy);
app.get('/usepolicy',                         routes.use_policy);
app.get('/help',                                    routes.help);

// API
app.get('/test',             api.test);
app.get('/playlist', api.get.playlist);
app.get('/listory',   api.get.history);
app.get('/search', api.youtube.search);
app.get('/settings', api.get.settings);

app.post('/pull',       api.set.music);
app.post('/remove',  api.remove.music);
app.post('/remove_from_pushed',  api.remove.pushedMusic);
app.post('/restore',api.restore.music);
app.post('/settings',api.set.settings);

app.post('/delete_all',api._delete._users_all_musics);
//app.post('/tweet',  api.twitter.tweet);

app.listen(port, function(){
  console.log(conf.now() + "LISTENING*** on port %d in %s", app.address().port, app.settings.env);
});
