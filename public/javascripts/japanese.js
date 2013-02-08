
var PLAYLIST_MIN_LENGTH = 3;

var _playlist_length_for_urging = 0;

var urge = function(playlist_length){

  //$("#main-container").remove();

  playlist_length_for_urging = playlist_length;
  var sugg = $(document.createElement('div')).addClass('div_urging');
  sugg.html('<span class="urging">現在プレイリストに入ってる曲：' + playlist_length + '曲<br>まずはyoutube-searchかradioモードから3曲引っ張りましょう</span>');
  $("img#img_radio_mode").after(sugg);

  $(".pull_btn").live('click',function(e){
    _playlist_length_for_urging++;
    updateUrgingText();
  });
}; // END ruge()

function updateUrgingText(){
  if(_playlist_length_for_urging > 2){
    alert("おめでとうございます!!プレイリストに3曲以上入りました!\nプレイリストモードから聞き流せます");
    window.location.href = './';
  }else{
    $('div.div_urging').html('<span class="urging">現在プレイリストに入ってる曲：' + _playlist_length_for_urging + '曲<br>まずはyoutube-searchかradioモードから3曲引っ張りましょう</span>');
  }
}

function generateTimelineUl(list,parent){
  // initialize
  parent.html('');
  // main ul
  ul = document.createElement('ul');
  $(ul).addClass('twitter_ul');
  for(i = 0; i<list.length; i++){

    // inner li
    li = document.createElement('li');
    $(li).addClass('twitter_li');

    // left block
    $(document.createElement('div'))
      .addClass('tw_box_left')
      .append('<div class="tw_icon"><a href="https://twitter.com/' + list[i].from_user + '" target="_blank"><img src="' + list[i].profile_image_url + '"/></a></div>')
      .appendTo($(li));

    // right block
    tw_name = document.createElement('p');
    $(tw_name).addClass('tw_name').html('<a href="https://twitter.com/' + list[i].from_user + '" target="_blank">@' + list[i].from_user + '</a>');
    tw_contents = document.createElement('p');
    min_before = getMinBefore(list[i].created_at);
    $(tw_contents).addClass('tw_contents')
      .append('<p class="tw_text">' + list[i].text + '</p>')
      .append('<a href="https://twitter.com/' + list[i].from_user + '/status/' + list[i].id_str + '" class="tw_ctime" target="_blank">' + min_before + '</a>');
    $(document.createElement('div'))
      .append($(tw_name))
      .append($(tw_contents))
      .addClass('tw_box_right')
      .appendTo($(li));

    // finally
    $(li).appendTo($(ul));
  }
  $('<li class="twitter_li" id="more"><a id="load_more">Load More?</a></li>').appendTo($(ul));
  $(ul).appendTo(parent);
  setScrolling(ul);
};

function getTwitterPublicTimeline(query,callback){
  data = {
    q : 'nowplaying',
    lang : 'ja',
    rpp : 100,
  };
  $.ajax({
    url : 'http://search.twitter.com/search.json',
    dataType : 'jsonp',
    data : data,
    success : function(res,stat){
      //res.results.removeNoise();
      callback(res.results);
    },
    error : function(err){
        console.log(err);
    }
  });
}

function setScrolling(elem)
{
    $(elem).animate({ 'right' : '32720px' },800000,'linear');
}

function refreshTemplate()
{
    $("div.main-container-urge").remove();
    regenerateMainContainer();
}

function regenerateMainContainer()
{
    var contents = '<div id="main-container" class="main-container"><!-- logined visit --><div class="" id="playlist01"><ul class="unstyled"><li><span id="indx_num" class="lead m_title"></span><span class="lead m_title"> -- </span><span id="music-title" class="lead m_title"></span><span class="pull_btn_area" style="float:right;"></span><hr></li><li><table id="controler"><tbody><tr calss="tb_hover_ignore"><td><button id="prev_btn" class="btn ready"><i class="icon-step-backward"></i></button></td><td><button id="play_btn" class="btn ready"><i class="icon-play"></i></button></td><td id="twitter_btn"><button id="tweet_to_share" class="btn ready"><img src="images/twitter-logo-2.png"/></button></td><td><button id="info_btn" class="btn ready"><i class="icon-resize-small"></i></button></td><td><button id="next_btn" class="btn ready"><i class="icon-step-forward"></i></button></td></tr></tbody></table></li><li><div id="video"></div></li></ul></div></div><!--/.main-container-->';
    $("div#contents-wrapper").html(contents);
    init();
}
