/*
 * util.js
*/

var conf = require('./conf').getConf();
var http = require('http');
var dao  = require('./dao.js').dao;
var twitter_lib  = require('./twitter_lib.js');

exports.util = {

    // validate youtube search query
    validate_query : function(query){
      if(query == null){
        query = "";
      }
      while(query.match("%")){
        query = query.replace("%","+");
      }
      while(query.match(" ")){
        query = query.replace(" ","+");
      }
      //while(query.match("&")){
        query = query.replace("&","+");
      //}
      //while(query.match('?')){
        query = query.replace("?","+");
      //}
      while(query.match("=")){
        query = query.replace("=","+");
      }
      while(query.match("　")){
        query = query.replace("　","+");
      }
      return query;
    },

    // mix in an other music
    mix_in : function(arr, params, callback){
      if(typeof arr.length === 'undefined' || arr.length === 0){
        // this user does not have playlist yet
        callback(arr);
      }else if(arr.length < 3){
        // do nothing : playlist is too short
        callback(arr);
      }else{
        dao.getPushedMusics(params,function(pushed_musics){
          arr2 = arr;
          arr2 = appendPushedMusics(arr2, pushed_musics, params.id);
          callback(arr2);
        });
      }
    },

    pushMusic : function(params,callback){
      if(params.from_inner){
        dao.setNewPushedFromInner(params,function(res){
          if(res){
            console.log(conf.now() + '### PUSHED_FROM_INNER ###');
            callback(true);
          }else{
            callback(false);
          }
        });
      }else{
        dao.setNewPushedFromTwitterNowplaying(params,function(res){
          if(res){
            console.log(conf.now() + '### PUSHED_FROM_TWITTER ###pushed_by:::::' + params.pushed_by);
            callback(true);
          }else{
            callback(false);
          }
        });
      }
    },

    bot_tweet : function(params,callback){
      twitter_lib.bot_tweet_process(params,function(err,data){
        callback(err,data);
      });
    },

    bot_follow : function(params,callback){
      twitter_lib.bot_follow_process(params,function(err,data){
        callback(err,data);
      });
    },
};

var getOne = function(id,callback){
  var params = {my_id:id};
  dao.getOneFromPushed(params,function(music){
      callback(music);
  });
};

function appendPushedMusics(arr_origin, arr_pushed, my_id){
  for(var i in arr_pushed){
    // set owner_i => my_id
    // set stat => mixed
    arr_pushed[i].owner_id = my_id;
    arr_pushed[i].stat   = 'mixed';
    arr_origin.push(arr_pushed[i]);
  }
  return arr_origin;
}
