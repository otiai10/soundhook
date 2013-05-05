
/*
 * GET home page.
 */

var api = require('./api.js');
var conf = require('../my_modules/conf').getConf();
var CONST = require('../my_modules/constants').constants;
var dao  = require('../my_modules/dao.js').dao;

var oauth = new (require('oauth').OAuth)(
    conf.request_token,
    conf.access_token,
    conf.consumer_key,
    conf.consumer_secret,
    conf.oauth_version,
    conf.callback_destination,
    conf.encryption
);

exports.index = function(req, res){
/******
 for google adsense
******/
  res.render(
    'use_policy',
    {
      title : 'SoundHook - 利用規約',
      rurl  : conf.rurl,
    }
  )
/***
 END
***/
//  var help = false;
//  if(req.query.help != void 0 && req.query.help == 1){
//    help = true;
//  }
//  if(req.session.user_profile == void 0){
//    // 未ログイン
//    res.render('login', {
//      title : 'Login - SoundHook',
//      rurl  : conf.rurl,
//    })
//  }else{
//    // ユーザのプレイリスト数を評価
//    dao.getMyPlaylist(req.session.user_profile.id, {get_all:true},function(results){
//      if(results.rows.length < CONST.MINIMUM_PLAYLIST_LEN){
//        res.render('welcome', {
//          title : 'Welcome! - SoundHook',
//          rurl  : conf.rurl,
//        })
//      }else{
//        res.render('index', {
//              title: 'SoundHook',
//              list_active : null,
//              help        : help,
//              rurl        : conf.rurl,
//        })
//      }
//    });
//  }
};

exports.prepare = function(req,res){
/******
 for google adsense
******/
  res.render(
    'use_policy',
    {
      title : 'SoundHook - 利用規約',
      rurl  : conf.rurl,
    }
  )
/***
 END
***/
//  if(req.session.user_profile == void 0){
//    // 未ログイン
//    res.render('login', {
//    //res.render('index', {
//      title : 'Login - SoundHook',
//      rurl  : conf.rurl,
//    })
//  }else{
//    // ユーザのプレイリスト数を評価
//    dao.getMyPlaylist(req.session.user_profile.id, {get_all:true},function(results){
//      if(results.rows.length >= CONST.MINIMUM_PLAYLIST_LEN){
//        res.render('index', {
//          title : 'SoundHook',
//          help  : false,
//          rurl  : conf.rurl,
//        })
//      }else if(req.body.keyword01 || req.body.keyword02){
//        var query01, query02;
//        if(req.body.keyword01 && req.body.keyword02){
//          query01 = req.body.keyword01;
//          query02 = req.body.keyword02;
//        }else{
//          query01 = query02 = String(req.body.keyword01 + req.body.keyword02);
//        }
//        dao.searchFromPushed(query01, query02, CONST.MINIMUM_PLAYLIST_LEN, function(results){
//          for(var i=0; i<results.rows.length; i++){
//            var music = results.rows[i];
//            music.owner_id     = req.session.user_profile.id;
//            music.playlist_num = 0;//これなくそうよ
//            dao.setToMyPlaylist(music, function(success){
//              //do nothing
//            });
//          }
//          res.render('welcome2', {
//                title: 'Congrats! - SoundHook',
//                list_active : null,
//                rurl        : conf.rurl,
//                list        : results.rows,
//          })
//        })
//      }else{
//        res.render('welcome', {
//          title : 'Welcome! - SoundHook',
//          rurl  : conf.rurl,
//        })
//      }
//    });
//  }
};

exports.oauth_twitter = function(req,res){
  oauth.getOAuthRequestToken(function(er,oa_token,oa_token_secret,results){
    if(er){
      res.send(er);
    }else{
      req.session.oauth = {};
      req.session.oauth.tk = oa_token;
      req.session.oauth.tk_secret = oa_token_secret;
      res.redirect('https://twitter.com/oauth/authenticate?oauth_token=' + oa_token);
    }
  });
};
  
exports.oauth_twitter_callback = function(req,res){
  if(req.session.oauth){
    // verifier is given
    req.session.oauth.verifier = req.query.oauth_verifier;

    oauth.getOAuthAccessToken(
      req.session.oauth.tk,
      req.session.oauth.tk_secret,
      req.session.oauth.verifier,
      function(er,oa_ax_tk,oa_ax_tk_secret,results){
        if(er){
          res.send(er);
        }else{
          req.session.oauth.ax_tk = oa_ax_tk;
          req.session.oauth.ax_tk_secret = oa_ax_tk_secret;
          req.session.user_profile = results;
          // append user_id to session
          api.get.user_id_by_name(req.session,function(info){
            if(info === false){
              api.get.user_id_by_name(req.session,function(info){
                req.session.user_profile.id        = info.id;
                req.session.user_profile.mix_level = info.mix_level;
                res.redirect(conf.rurl);
              });
            }else{
              req.session.user_profile.id        = info.id;
              req.session.user_profile.mix_level = info.mix_level;
              res.redirect(conf.rurl);
            }
          });
        }
      }
    ); //END oauth.getOAuthAccessToken();
  }
};

exports.signout = function(req,res){
  delete req.session.oauth;
  delete req.session.user_profile;
  res.redirect(conf.rurl);
};

exports.privacy_policy = function(req,res){
  res.render(
    'privacy_policy',
    {
        title : 'SoundHook - プライバシーポリシー',
        rurl  : conf.rurl,
    }
  )
};

exports.help = function(req,res){
  res.render(
    'help',
    {
        title : 'SoundHook - ヘルプ',
        rurl  : conf.rurl,
    }
  )
}

exports.use_policy = function(req,res){
  res.render(
    'use_policy',
    {
      title : 'SoundHook - 利用規約',
      rurl  : conf.rurl,
    }
  )
};

exports.steerings = function(req,res){
  res.render(
    'steerings',
    {
      title: 'SoundHook',
      rurl : conf.rurl,
    }
  );
};

exports.inquiry = function(req,res){
  res.render(
    'inquiry',
    {
      title: 'hoge',
      rurl : conf.rurl,
    }
  )
};
