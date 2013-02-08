$(function(){
///////////// jQuery

// init

var playlist = [];
var index    = 0;

$.ajax({
  type:"GET",
  url: "./playlist",
  success: function(res){
    if(res !== false){
      for(var i in res){
        playlist.push(res[i]);
      }
      setIndexNumberYoutube(0);
    }else{
      // not logined
    }
  },
  error: function(err){
    console.log(err);
  }
});

var setIndexNumberYoutube = function(index){
  $("#player").attr({
    index : index,
    data  : 'http://www.youtube.com/v/' + playlist[index].hash + '?enablejsapi=1&playerapiid=player&fmt=18'
  });
};
 
///////////// END jQuery
});
