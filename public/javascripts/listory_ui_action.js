/**
 *  listory_ui_action.js
**/

$(function(){
// {{{ jQuery
$(".action_btn").hide();

$(".status").toggle(
  function(){
    $(this).next().slideDown(100);
  },
  function(){
    $(this).next().slideUp(100);
  }
);

$(".remove_this").on('click',function(){
  music_id = $(this).attr('action_id');
  remove_this(music_id,function(){
  });
});

$(".pull_back_this").on('click',function(){
  music_id = $(this).attr('action_id');
  restore_this(music_id,function(){
  });
});

// {{{ delete_confirmed click
$("#delete_confirmed").on('click',function(){
  delete_process();
});
// }}}

// }}}
});

function remove_this(remove_id,callback){
// {{{
  $('.pull_btn_area' + remove_id).html('<div id="rotater" class="rotate"></div>');
  $.ajax({
    type : 'POST',
    url  : './remove',
    data : 'remove_id=' + remove_id,
    success:function(res){
      if(res){
        setTimeout(function(){
          $('.pull_btn_area' + remove_id)
            .html('<h5 class="inserted">Removed from your playlist</h5>')
            .hide().fadeIn(200);
        },800);
      }
    },
    error:function(e){
      console.log(e.message);
    }
  });
// }}}
}

function restore_this(restore_id,callback){
// {{{
  $('.pull_btn_area' + restore_id).html('<div id="rotater" class="rotate"></div>');
  $.ajax({
    type : 'POST',
    url  : './restore',
    data : 'restore_id=' + restore_id,
    success:function(res){
      if(res){
        setTimeout(function(){
          $('.pull_btn_area' + restore_id)
            .html('<h5 class="inserted">Recovered on your playlist</h5>')
            .hide().fadeIn(200);
        },800);
      }
    },
    error:function(e){
      console.log(e.message);
    }
  });
// }}}
}

// {{{ delete_process
function delete_process(){
  if(confirm('まじで??')){
    if(confirm('後悔しませんね？')){
      delete_all_ajax_request(function(ret){
        if(ret == true){
          alert("削除しました(´；ω；`)\nウィンドウを閉じます");
          window.location.href = './';
        }else{
          // do something?
        }
      });
    }else{
      alert('けんめいですε-(´∀｀*)ﾎｯ');
    }
  }else{
    alert('けんめいですε-(´∀｀*)ﾎｯ');
  }
}

// }}}

// {{{
function delete_all_ajax_request(callback){
  $.post('./delete_all', {confirmed : true}, function(res){
    callback(res);
  });
}
// }}}
