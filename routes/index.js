
/*
 * GET home page.
 */

var api = require('./api.js');
var conf = require('../my_modules/conf').getConf();

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
  res.render('index', {
        title: 'SoundHook',
        //pempl: res.partial('partials/privacy_policy.ejs')
        list_active : null,
        rurl        : conf.rurl,
  })
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
