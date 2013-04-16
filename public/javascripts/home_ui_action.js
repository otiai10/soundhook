playlist = [];
index    = 0;
playlist_type = 0;

var __player = {};

$(function(){ //=============================== jQuery Event Handle
getPlaylist(0);
init();

}); //===================== END jQ Event Handle

function getPlaylist(playlist_num){
  playlist = [];
  $.get("./playlist",{ id:null, name:null, get_all:false, mix_in:true, playlist_num:playlist_num},function(res){
    if(res !== false){
      for(var i =0; i < res.length; i++){ playlist.push(res[i]); }
      if(playlist.length < 3){ // (almost) new commer
        urge(playlist.length);
      }else{
        playlist = array_shuffle(playlist);
        swfobject.embedSWF(
          "http://www.youtube.com/v/" + playlist[0].hash+ "?enablejsapi=1&autoplay=1&playerapiid=player",
          "video","480","350","8",null,null,{allowScriptAccess:"always"},{id:"player"}
        );
        $("#music-title").html(playlist[0].title);
        $("#indx_num").html("(1/" + playlist.length + ")");
        if(typeof document.getElementById("player").loadVideoById !== 'undefined'){
          document.getElementById("player").loadVideoById(playlist[0].hash);
        }
        playlist_type = playlist_num;
        appear_pull_btn(0);
      }
    }else{ }
  });
}

function createShareUrl(music){
  share_url = encodeURIComponent('http://youtu.be/'+music.hash) + '&text=' + encodeURIComponent(music.title) + ' via @sound_hook';
  return share_url;
}

function play_this(){
  document.getElementById('player').playVideo();
  $("#play_btn").html('<i class="icon-pause"></i>').addClass('twinkle');
  $("#equalizer").remove();
  $("#music-title").append(
    '<span id="equalizer">   '
    + '<img class="equalizer" src="images/equalizer01.gif"/><img class="equalizer" src="images/equalizer01.gif"/>'
    + '</span>');
}

function pause_this(){
  document.getElementById('player').pauseVideo();
  $("#play_btn").html('<i class="icon-play"></i>').removeClass('twinkle');
  $("#equalizer").remove();
  $("#equalizer").remove();
}

function play_prev(){
  if(index === 0){ index = playlist.length-1; }else{ index = index - 1; }
  setIndexNumberYoutube(index,function(){});
}

function play_next(){
  if(index === playlist.length-1){ index = 0; }else{ index = index + 1; }
  setIndexNumberYoutube(index,function(){});
}

function info_this(){
  $("div#video_tl_container").css({
    'opacity' : '1',
    'height'  : '410',
  });
  togglePublicTimeLine();
}

function onYouTubePlayerReady(playerid){
  document.getElementById(playerid)
  .addEventListener('onStateChange','statusWatch');
  document.getElementById(playerid)
  .addEventListener('onError','confirmRemove');

  __player = document.getElementById('player');
}

function confirmRemove(e){
    // すぐ「次へ」ボタン押されちゃう場合があるので、ここで取っとく
    var target_index = index;
    setTimeout(function(){
      if(getActive() === 0){
        //alert("無効な動画のようです(´・ω・`)\nマイリスト曲はメニューのListoryから削除できます");
      }else{
        removePushedProcess(target_index);
      }
    },1000);
}

function removePushedProcess(target_index){
  removeFromPushed(playlist[target_index].id,function(res){
    if(res){
      play_next();
    }
  });
}

function statusWatch(newState){
  switch(newState){
    case 0: pause_this();
      if($("#switch_repeat_mode").attr('enabled') === '1'){
        setIndexNumberYoutube(index,function(){index = index});
      }else{
          if(playlist.length -1 > index){
            setIndexNumberYoutube(index+1,function(){index = index + 1;});
          }else{
            setIndexNumberYoutube(0,function(){index = 0;});
          }
      }
      break;
    case 1:
      play_this();
      break;
    case 2:
      pause_this();
      break;
    default:
  }
}

function setIndexNumberYoutube(idx,callback){
  document.getElementById("player").loadVideoById(playlist[idx].hash);
  $("#music-title").html(playlist[idx].title);
  now_num = idx + 1;
  $("#indx_num").html("(" + now_num  + "/" + playlist.length + ")");
  $("#player").attr({
    index : idx,
  });
  appear_pull_btn(idx);
  callback();
}

function array_shuffle(arr){
  result = [];
  len = arr.length;
  while(len){
    focused = Math.floor( Math.random() * len);
    result.push(arr[focused]);
    arr.splice(focused,1);
    len = len - 1;
  }
  return result;
}

function appear_pull_btn(indx_num){
  if(playlist[indx_num].stat === 'mixed'){
    $(".pull_btn_area").html("");
    $(document.createElement('a')).attr({
        'class'     : 'btn btn-info pull_btn ' + playlist[indx_num].hash, 'hash'     :  playlist[indx_num].hash,
        'title'     : playlist[indx_num].title,                           'owner_id' : playlist[indx_num].owner_id,
        'pushed_by' : playlist[indx_num].pushed_by,                       'tabindex' : '0',
    }).html('<img class="push_icon" src="http://api.twitter.com/1/users/profile_image/' + playlist[indx_num].pushed_by + '" height="30px"/>Add this to your playlist?' + '<br><span class="by">by @' + playlist[indx_num].pushed_by + '</span>')
    .appendTo(".pull_btn_area");
  }else if(playlist[indx_num].stat === 'removed'){
    $(".pull_btn_area").html('').html('<span class="inserted">already removed</span>'); 
  }else if(playlist[indx_num].stat === 'mine'){
    $(".pull_btn_area").html('').html('<a id="remove_this" href="#" remove_id="' + playlist[indx_num].id + '"><li class="icon-remove"></li></a>');
  }else{
  }

  // {{{ .pull_btn click
  $(".pull_btn").off('click');
  $(".pull_btn").on('click',function(e){
    $(this).off('click');
    // stat
    playlist[index].stat = 'mine';
  
    dataStr = 'hash=' + $(this).attr('hash')
              + '&title=' + $(this).attr('title')
              + '&owner_id=' + $(this).attr('owner_id')
              + '&pushed_by=' + $(this).attr('pushed_by')
              + '&list_active=' + getActive()
              + '&from_search=false';
    class_name = $(this).attr('hash');
    $.post('./pull', dataStr, function(res){
      if(res){
        $('a.'+class_name).fadeOut(600,function(){
            $(".pull_btn_area").prepend('<h2 class="inserted">Good Hook!</h2>').hide().fadeIn(200);
        });
      }
    });
  });
  // }}}

}

function remove_this(remove_id,callback){
  $('.pull_btn_area').html('<div id="rotater" class="rotate"></div>');
  $.post('./remove', 'remove_id=' + remove_id, function(res){
    if(res){
      setTimeout(function(){
        $('.pull_btn_area').html('<h4 id="notion">Please reload to affect</h4>').prepend('<h3 class="inserted">Removed from your playlist</h3>')
        .hide().fadeIn(200,function(){
          $('#notion').fadeOut(4000);
        });
      },800);
    }
  });
}

function init(){

  // {{{ #signin_first click
  $("#signin_first").on('click',function(e){
    $(this).removeClass('btn').removeClass('btn-large').removeClass('btn-info').html('').after('<div id="rotater" class="rotate"></div>');
  });
  // }}}
  
  // {{{ plauy_btn toggle
  $("#play_btn").toggle(
    function(){ pause_this(); $(this).tooltip({title:'play'});},
    function(){ play_this(); $(this).tooltip({title:'pause'});}
  );
  // }}}
  
  // {{{ info_btn toggle
  $("#info_btn").toggle(
    function(){
      //$("#player").attr({height:0});
      //$("#twitter-widget-0").css({height: '0px'});
      $("div#video_tl_container").css({
        'opacity' : '0',
        'height'  : '0',
      });
      $(this).html('<i class="icon-resize-full"></i>');
      // keybind explain
      effect.flashKeybindExp();
    },
    function(){ info_this(); $(this).html('<i class="icon-resize-small"></i>'); }
  );
  // }}}
  
  // {{{ #prev_btn click
  $("#prev_btn").on('click',function(e){
    play_prev();
  });
  // }}}
  
  $("#prev_btn").hover(function(){
    $("#prev_btn").tooltip('show');
  });
  
  // {{{ #next_btn click
  $("#next_btn").on('click',function(e){
    play_next();
  });
  // }}}
  
  
  // {{{ #remove_this click
  $("#remove_this").live('click',function(){
    remove_id = $(this).attr('remove_id');
    $(".pull_btn_area").html('').append('<div class="btn-group"><button id="remove_confirmed" class="btn btn-danger" remove_id="' + remove_id + '">Remove</button><button id="remove_cancel" class="btn">Cancel</button></div>').hide().fadeIn();
  });
  // }}}
  
  // {{{ #remove_confirmed click
  $("#remove_confirmed").live('click',function(){
    $(this).die('click');
    playlist[index].stat = 'removed';
    remove_id = $(this).attr('remove_id');
    remove_this(remove_id,function(res){ if(res){}else{} });
  });
  // }}}
  
  // {{{ #remove_cancel click
  $("#remove_cancel").live('click',function(){
    $(".pull_btn_area").html('').append('<a id="remove_this" href="#"><li class="icon-remove"></li></a>').hide().fadeIn();
  });
  // }}}
  
  // {{{ #tweet_to_share click
  $("#tweet_to_share").on('click',function(e){
    option = "width=720,height=280,left=" + e.clientX + ",top=" + e.clientY;
    share_url = createShareUrl(playlist[index]);
    window.open('https://twitter.com/intent/tweet?lang=en&hashtags=nowplaying&url=' + share_url ,"",option);
  });
  // }}}

  // {{{ #repeat-one click
  $("#switch_repeat_mode").on('click',function(){
    if($(this).attr('enabled') === '0'){
        $(this).attr({'enabled': '1'}).addClass('enabled');
    }else{
        $(this).attr({'enabled':'0'}).removeClass('enabled');
    }
  });
}

// new version object for youtube controller
var yt = {
  playPrev: function(){
    play_prev();
    effect.playPrev();
  },

  playNext: function(){
    play_next();
    effect.playNext();
  },

  volumeUp: function(){
    var volume_now = __player.getVolume();
    var volume_new = volume_now + 1;
    __player.setVolume(volume_new);
    effect.volumeUp();
  },

  volumeDown: function(){
    var volume_now = __player.getVolume();
    var volume_new = volume_now - 1;
    __player.setVolume(volume_new);
    effect.volumeDown();
  },
}

var effect = {
  playPrev: function(){
  },

  playNext: function(){
  },

  volumeUp: function(){
    var vol = __player.getVolume();
    this.flashVolume(vol);
  },

  volumeDown: function(){
    var vol = __player.getVolume();
    this.flashVolume(vol);
  },

  flashKeybindExp: function(){
    $("div.keybind-exp").fadeIn(100).delay(1500).fadeOut(800);
  },

  flashVolume: function(vol){
    $("div#vol-action>span").html(vol);
    $("div#vol-action").queue([]);
    $("div#vol-action").show().css({opacity:0.6}).hide().fadeIn(100).delay(400).fadeOut(300);
  }
}

