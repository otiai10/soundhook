/**
 *  settings_ui_action.js
**/

$(function(){

$("button.commit_btn").live('click',function(){
  $("#action_td").html('').html('<div id="rotater" class="rotate"></div>');
  mix_level = $("#mix_level").val();
  ng_word   = $("#ng_word").val();

  ng_word = (ng_word == '') ? 'NULL' : ng_word;

  data = 'mix_level=' + mix_level
    + '&ng_word=' + ng_word;

  $.ajax({
    type : 'POST',
    url  : './settings',
    data : data,
    success:function(res){
      if(res){
        setTimeout(function(){
          $('#action_td').html('<h5 id="notion">Please signout to affect</h5>');
          $("#action_td")
            .prepend('<h5 class="inserted">Setting changed</h5>')
            .hide().fadeIn(200,function(){
              $("#notion").fadeOut(6000);
            });
        },1000);
      }
    },
    error:function(e){
      console.log(e.message);
    }
  });

});

// }}}
});
