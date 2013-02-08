/*
 * search ui
**/

$(function(){
///////////// jQuery
var from = $(".pull_btn").attr('from');
if(from == 'earphoneshare'){
  var dom = document.getElementsByClassName('pull_btn')[0];
  process_pull(dom,from);
}

$(".pull_btn").on('click',function(e){
  console.log(this);
  process_pull(this,from);
});

moveIndicator(getActive());

///////////// END jQuery
});

function process_pull(dom,from){
  $(dom).off('click');
  dataStr = 'hash=' + $(dom).attr('hash')
            + '&title=' + $(dom).attr('title')
            + '&owner_id=' + $(dom).attr('owner_id')
            + '&pushed_by=' + $(dom).attr('pushed_by')
            + '&list_active=' + getActive()
            + '&from_search=true';
  class_name = $(dom).attr('hash');
  $.ajax({
    type : 'POST',
    url  : './pull',
    data : dataStr,
    success:function(res){
      console.log(res);
      if(res){// response exists>>>
        twinkleListIcon(getActive());
        $('button.'+class_name)
        .fadeOut(500,function(){
          $('td.meta_info.'+class_name)
            .prepend('<h2 class="inserted">Added to your playlist</h2><br>')
            .hide().fadeIn(200,function(){
              if(from == 'earphoneshare'){
                setTimeout(function(){
                  window.close();
                },1000);
              }
            });
        });
      }// <<<response exists
    },
    error:function(e){
      console.log(e.message);
    }
  });
}
