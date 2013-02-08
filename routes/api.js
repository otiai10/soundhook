/*
 * api.js
*/
var http = require('http');
var dao  = require('../my_modules/dao.js').dao;
var util = require('../my_modules/util.js').util;
var conf = require('../my_modules/conf').getConf();

exports.test = function(req,res){
  dao.test(function(result){
    res.send(result);
  }); 
};

exports.get = {

  // get user id
  user_id_by_name  : function(sess,callback){
    if(sess.user_profile.screen_name){
      dao.getUserIdByName(sess.user_profile.screen_name,function(result){
        if(result.rows.length < 1){
          // new commer
          console.log(conf.now() + 'NEWCOMER**** '+sess.user_profile.screen_name);
          util.bot_follow({ 'screen_name': sess.user_profile.screen_name},function(err,data){ if(err){console.log(err);} });
          // insert
          dao.setNewUser(sess.user_profile.screen_name,function(respo){
            callback(false);
          });
        }else{
          // existing user
          callback(result.rows[0]);
        }
      });
    }
  },

  // get user info
  settings : function(req,res){
    if(typeof req.session.user_profile === 'undefined'){
      res.redirect('/');
    }else{
      dao.getUserInfoById(req.session.user_profile.id,function(rows){
        if(rows.row[0].ng_word === 'NULL'){
          rows.row[0].ng_word = '';
        }
        res.render('settings',{
          title: 'Settings - SoundHook',
          info: rows.row[0],
          rurl: conf.rurl,
          //inc01: res.partial('privacy_policy.ejs'),
        });
      });
    }
  },
  
  // get playlist
  playlist : function(req,res){
    if(typeof req.session.user_profile === 'undefined'){
      console.log(conf.now() + '##### NOT-LOGINED-VISIT #####');
      res.send(false);
    }else{
      console.log(conf.now() + '> WELCOME < ' + req.session.user_profile.screen_name);

      if(req.query.playlist_num === '100'){
        dao.getForRandomStream({},function(result){
          arr = result.rows;
          for(var i in arr){
            arr[i].stat = 'mixed';
          }
          res.send(arr);
        });
      }else{
        dao.getMyPlaylist(req.session.user_profile.id, req.query, function(result){
          if(req.query.mix_in){
            // mix_in
            params = {
              id        : req.session.user_profile.id,
              mix_level : req.session.user_profile.mix_level,
            };
            util.mix_in(result.rows, params, function(arr){
              res.send(arr);
            });
          }else{
            res.send(result.rows);
          }
        }); // END dao.getMyPlaylist
      }
    }

  },

  // get history
  history : function(req,res){
    if(typeof req.session.user_profile === 'undefined'){
      console.log(conf.now() + '#### illeagal visit ####');
      res.redirect('/');
    }else{
      params = {
        get_all : true,
      };
      dao.getMyPlaylist(req.session.user_profile.id, params, function(arr){
        res.render('listory',{
            title: 'Listory - SoundHook',
            list : arr.rows,
            rurl: conf.rurl,
            //inc01: res.partial('privacy_policy.ejs'),
            list_active : null,
        });
      });
    }
  },

};

exports.set = {

    // set music
    music : function(req,res){
      if(req.session.user_profile.id == void 0){
        res.redirect('/');
      }else{
        if(req.body.from_search == 'true'){
          // do nothing
        }else{
          req.body.owner_id = req.session.user_profile.id;
        }
        if(req.body.list_active === void 0){
          // do nothing
        }else{
          req.body.playlist_num = req.body.list_active;
        }
        dao.setToMyPlaylist(req.body,function(result){
          if(req.body.from_search == 'true'){
            params = {
              hash      : req.body.hash,
              title     : req.body.title,
              pusher_id : req.body.owner_id,
              pushed_by : req.body.pushed_by,
              playlist_num : req.body.list_active,
              from_inner: true,
            };
            util.pushMusic(params,function(bool){});
          }else{
            mess = '@' + req.body.pushed_by + ' Thank you for giving me hint. / ' + req.body.title + ' http://youtu.be/'
              + req.body.hash;
            params = {
              message  : mess,
            };
            util.bot_tweet(params,function(){});
          }
          res.send(result);
        });
      }
    },

    // set settings
    settings : function(req,res){
      if(typeof req.session.user_profile === 'undefined'){
        res.redirect('/');
      }else{
        // TODO: validate >>>>
        req.body.ng_word = 'NULL';
        //<<<<<
        dao.setUserProfile(req.body, req.session.user_profile.id, function(ret){
          if(ret){
            res.send(ret);
          }else{
            res.send(false);
          }
        });
      }
    },

};

exports.remove = {

    // remove music
    music : function(req,res){
      if(typeof req.session.user_profile.id === 'undefined'){
        res.redirect('/');
      }else{
        dao.removeFromMyPlaylist(req.body.remove_id, req.session.user_profile.id, function(ret){
          if(ret){
            res.send(ret);
          }else{
            res.send(false);
          }
        });
      }
    },

    // remove music from pushed music
    pushedMusic : function(req,res){
      if(req.session.user_profile.id === void 0){
        res.redirect('/');
      }else{
        dao.removeFromPushed(req.body.remove_id, function(ret){
          if(ret){
            res.send(ret);
          }else{
            res.send(false);
          }
        });
      }
    },

};

exports.restore = {

    // restore music
    music : function(req,res){
      if(typeof req.session.user_profile.id === 'undefined'){
        res.redirect('/');
      }else{
        dao.restoreFromMyPlaylist(req.body.restore_id, req.session.user_profile.id, function(ret){
          if(ret){
            res.send(ret);
          }else{
            res.send(false);
          }
        });
      }
    },

};

exports._delete = {

    // delete user's all musics
    _users_all_musics : function(req,res){
      if(req.session.user_profile.id == void 0){
        res.redirect('/');
      }else{
        dao._deleteUsersAllMusics(req.session.user_profile, function(ret){
          res.send(ret);
        });
      }
    },

};

exports.youtube = {

    // search on youtube about query
    search : function(req,res){
        // logined required
        if(typeof req.session.user_profile === 'undefined'){
          res.redirect('/');
        }else{ //ここ新しく追加したelse。header重複が起こっていたとみられる
            // validation
            req.query.qu = util.validate_query(req.query.qu);

            var option = {
              host   : 'gdata.youtube.com',
              port   : 80,
              path   : '/feeds/api/videos?alt=json&q=' + req.query.qu + '&max-results=18',
              method : 'GET'
            };
            http.get(option, function(ret){
              ret.setEncoding('utf8');
              data = "";
              ret.on('data',function(chunk){
                data = data + chunk;
              });
              ret.on('end',function(){
                // this JSON.parse throw errors oftenly
                try{
                  data = JSON.parse(data);
                  arr = [];
                  for(var i in data.feed.entry){
                    ent = data.feed.entry[i];
                    arr.push({
                      title : ent.title.$t,
                      url   : ent.link[0].href,
                      hash  : ent.link[0].href.replace('http://www.youtube.com/watch?v=','').replace('&feature=youtube_gdata',''),
                    });
                  }
                  list_active = null;
                  if(req.query.list !== void 0){
                    list_active = req.query.list;
                  }
                  from_service = '0';
                  if(req.query.from === 'earphoneshare'){
                    from_service = 'earphoneshare';
                  }
                  res.render('search',{
                      title: 'Search - SoundHook',
                      test : arr,
                      list_active : list_active,
                      from_service: from_service,
                      rurl: conf.rurl,
                  });
                } catch(e) {
                  console.log(conf.now() + '!!!!! JSON PARSE ERROR !!!!! >>>>>');
                  console.log('The key word is ' + req.query.qu );
                  console.log(e);
                  res.redirect('/');
                }
              });
            });
        }
    },
};

exports.twitter = {
    // tweet from @sound_hook
    tweet : function(req,res){
      console.log(req.body);
    },
};
