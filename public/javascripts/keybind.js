/**
 * keybind
**/

window.onkeydown = keybind;

function keybind(e){
  switch(e.keyCode){
    case 37:
        yt.playPrev();
      break;
    case 38:
        yt.volumeUp();
      break;
    case 39:
        yt.playNext();
      break;
    case 40:
        yt.volumeDown();
      break;
    default:
      // bind nothing so far
  }
}
