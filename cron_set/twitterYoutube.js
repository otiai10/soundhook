/*
 * cron
*/
var util = require('../my_modules/util.js').util;
var conf = require('../my_modules/conf').getConf();
var http = require('http');

var option_twitter = {
  host    : 'search.twitter.com',
  port    : 80,
  path    : '/search.json?q=nowplaying&lang=ja&rpp=1',
  method  : 'GET',
};

var option_youtube = {
  host   : 'gdata.youtube.com',
  port   : 80,
  path   : '',
  method : 'GET',
};

var path_youtube = '/feeds/api/videos?alt=json&max-results=1&q=';

var cleanUpText = function(text){
  text = text.replace('#nowplaying','')
        .replace('#Nowplaying','')
        .replace('#nowPlaying','')
        .replace('#NowPlaying','')
        .replace('"','')
        .replace('"','')
        .replace('"','')
        .replace('"','')
        .replace('/','')
        .replace(/^ */,'')
        .replace(/^　*/,'')
        .replace('♪','')
        .replace('♫','')
        .replace('♩','')
        .replace('♬','')
        .replace(/http:.+/,'')
        .replace(/http:.+/,'')
        .replace(/#.+/,'');
  return text;
};

var hasNowplaingInHead = function(text){
  return (text.match(/^#nowplaying/) || text.match(/^#Nowplaying/) || text.match(/^#NowPlaying/));
};

var getYoutube = function(query, pushed_by){
  option_youtube.path = path_youtube + query;
  http.get(option_youtube, function(ret2){
    ret2.setEncoding('utf8');
    data2 = "";
    ret2.on('data',function(chunk2){
      data2 = data2 + chunk2;
    });
    // {{{ ret2.on
    ret2.on('end',function(){
      try{
        data2 = JSON.parse(data2);
      }catch (e){
        process.exit();
      }
      if(typeof data2.feed === 'undefined' || typeof data2.feed.entry === 'undefined'){
        process.exit();
      }else{
        if(data2.feed.entry[0].category[1].term === 'Music'){
          hash  = getHash(data2.feed.entry[0].link[0].href);
          title = data2.feed.entry[0].title.$t;

          params = {
            hash      : hash,
            title     : title,
            pusher_id : 0,
            pushed_by : pushed_by,
            from_inner: false,
          };
          util.pushMusic(params,function(is_success){
            if(is_success){
              console.log(conf.now() + 'INSERTED***> ' + hash + ' | ' + title + ' | ' + pushed_by);
              mess = "Just hooked this! / " + params.title + ' http://youtu.be/' + params.hash;
              params_for_tweet = {
                message : mess,
              };
              util.bot_tweet(
                params_for_tweet,function(err,data){
                  console.log(conf.now() + ' auto hooking tweet');
                  process.exit();
              });
            }else{
              console.log(conf.now() + 'DAO returns false');
              process.exit();
            }
          });
        }
      }
    });
    // }}}
  });
};

var getHash = function(youtube_url){
  return youtube_url.replace('http://www.youtube.com/watch?v=','').replace('&feature=youtube_gdata','');
};

var __perform = function(){
  data = "";
  http.get(option_twitter,function(ret){
    ret.setEncoding('utf8');
    ret.on('data',function(chunk){
      data = data + chunk;
    });
    ret.on('end',function(){
      data = JSON.parse(data);
      query = data.results[0].text;
      pushed_by = data.results[0].from_user;
      if(hasNowplaingInHead(query)){
        query = cleanUpText(query);
        query = util.validate_query(query);
        getYoutube(query, pushed_by);
      }else{
        process.exit();
      }
    });
  });
};

__perform();
