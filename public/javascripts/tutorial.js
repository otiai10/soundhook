/**
 * tutorial.js
**/

var tutorial_index = 0;
$(function(){
  showNext();
  $("div.tutorial-hidden").on('click',function(){
    nextPage();
  });
});

function nextPage(){
  hideAll();
  showNext();
}

function showNext(){
  tutorial_index = tutorial_index + 1;
  $("div#tutorial0" + tutorial_index).hide().fadeIn(100);
}

function hideAll(){
  $("div.tutorial-hidden").fadeOut(100);
}
