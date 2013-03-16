var util = require('../my_modules/util.js').util;
var conf = require('../my_modules/conf.js').getConf();

var mess = '@otiai10 [[ALERT on ' + conf.serv_state + ']]' + conf.now() + ' Something going wrong on SoundHook Server!! Please check me!!!';
util.bot_tweet({message: mess}, function(err,data){
    if(err){ console.log(err); }
});
