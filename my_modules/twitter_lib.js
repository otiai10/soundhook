/**
 * twitter_lib.js
**/
var conf = require('./conf.js').getConf();

var OAuth = require('oauth').OAuth;
var oauth = new OAuth(
  conf.request_token,
  conf.access_token,
  conf.consumer_key,
  conf.consumer_secret,
  conf.oauth_version,
  null,
  conf.encryption
);

exports.bot_follow_process = function(params, callback){
  try{
    oauth.post(
      conf.api.friendships_create_api,
      conf.bot.access_token,
      conf.bot.access_token_secret,
      {'screen_name': params.screen_name},
      function(err, data){
        callback(err, data);
      }
    );
  }catch(e){
      callback(e,e);
  }
};

exports.bot_tweet_process = function(params, callback){
  try{
    oauth.post(
      conf.api.status_update_api,
      conf.bot.access_token,
      conf.bot.access_token_secret,
      {status: params.message},
      function(err, data){
        callback(err, data);
      }
    );
  }catch(e){
      callback(e,e);
  }
};

