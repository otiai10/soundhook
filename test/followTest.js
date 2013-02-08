/**
 * test for follow twitter FOLLOW (friendships/create) api
**/

var stub_data = { screen_name : 'otiai10' };
//var conf   = require('../my_modules/conf').getConf();
//var tw_lib = require('../my_modules/twitter_lib.js');

//tw_lib.bot_follow_process({'screen_name': 'otiai10'},function(err,data){
//    console.log(err);
//    console.log(data);
//});

var util = require('../my_modules/util.js').util;

util.bot_follow(stub_data, function(err,data){
    console.log(err);
    console.log(data);
});
