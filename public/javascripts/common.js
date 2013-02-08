/**
 * common.js
**/

$(function(){ // jQuery Event Handler

  // {{{ a.tab_anc click
  $("a.tab_anc").on('click',function(e){
    if($('div.urge')[0]){
      refreshTemplate();
    }
    li_num = $(this).attr('list');
    getPlaylist(li_num);
    $("li.tab_li").removeClass('active');
    $(this).parent('li.tab_li').addClass('active');
    moveIndicator(li_num);
    togglePublicTimeLine();
  });
  // }}}

  // {{{ a.tab_anc hover
  $("a.tab_anc").hover(
    function(){
      $(this).tooltip('show');
    },
    function(){
      $(this).tooltip('hide');
    }
  );
  // }}}
}); // END jQuery Event Handler

function getActive(){
  li_num = $("div#list-changer>ul.ul-list-changer>li.active>a").attr('list');
  return parseInt(li_num);
}

// {{{ moveIndicator()
function moveIndicator(li_num){
  switch(parseInt(li_num)){
    case 0:
      slideIndicator('0%');
      break;
    default:
      slideIndicator('50%');
      break;
  }
}
// }}}

// {{{ slideIndicator()
function slideIndicator(destination){
  $('div#indicator').animate({
    'left':destination,
  },400);
}
// }}}

// {{{ remove_this()
var remove_this = function(remove_id,callback){
  $('.pull_btn_area').html('<div id="rotater" class="rotate"></div>');
  $.ajax({
    type : 'POST',
    url  : './remove',
    data : 'remove_id=' + remove_id,
    success:function(res){
      if(res){
        setTimeout(function(){
          $('.pull_btn_area' + remove_id).html('<h4 id="notion">Please reload to affect</h4>');
          $('.pull_btn_area' + remove_id)
            .prepend('<h5 class="inserted">Removed from your playlist</h5>')
            .hide().fadeIn(200,function(){
              $('#notion').fadeOut(4000);
            });
        },800);
      }
    },
    error:function(e){
      console.log(e.message);
    }
  });
};
// }}}

// {{{ getJST()
var getMinBefore = function(time_str){
  time  = new Date(time_str);
  ho = time.getHours();
  mi = time.getMinutes();
  se = time.getSeconds();
  now = new Date();
  h = now.getHours();
  m = now.getMinutes();
  s = now.getSeconds();
  min_before = Math.round(((m - mi)*60 + (s - se))/60);
  if(min_before <1){
    return 'Just Now';
  }else{
    return min_before + '分前';
  }
};

// {{{ twinkleListIcon()
var twinkleListIcon = function(li_num){
  switch(parseInt(li_num)){
    case 0:
      twinkleOnece('list0');
      break;
    case 1:
      twinkleOnece('list1');
      break;
    case 2:
      twinkleOnece('list2');
      break;
    default:
      break;
  }
}
// }}}

// {{{ twinkleOnece(str)
var twinkleOnece = function(str){
    $('#' + str).removeClass('twinkle_once').addClass('twinkle_once');
}

function togglePublicTimeLine(){
    if(getActive() == '100'){
        $("#twitter-widget-0").css({ height: '400px'});
    }else{
        $("#twitter-widget-0").css({ height: '0px'});
    }
}

function removeFromPushed(remove_id,callback){
  $.post('./remove_from_pushed', 'remove_id=' + remove_id, function(res){
    if(res){
      callback(true);
    }else{
      callback(false);
    }

  });
}
