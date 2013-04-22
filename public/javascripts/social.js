window.fbAsyncInit = function() {
  FB.init({
    appId      : '362529413866164', // App ID
    channelUrl : '',//'//WWW.YOUR_DOMAIN.COM/channel.html', // Channel File
    status     : true, // check login status
    cookie     : true, // enable cookies to allow the server to access the session
    xfbml      : true  // parse XFBML
  });
  $("#facebook_to_share").on('click',function(e){
    FB.ui({ 
      method: 'feed',
      name: playlist[index]['title'],
      caption: 'YouTube via SoundHook',
      //description: 'ですくりぷしょん',
      link: 'http://www.youtube.com/watch?v=' + playlist[index]['hash'],
    });
  });
};
// Load the SDK Asynchronously
(function(d, s, id){
 var js, fjs = d.getElementsByTagName(s)[0];
 if (d.getElementById(id)) {return;}
 js = d.createElement(s); js.id = id;
 js.src = "//connect.facebook.net/en_US/all.js";
 fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

$(function(){
  // {{{ #tweet_to_share click
  $("#tweet_to_share").on('click',function(e){
    option = "width=720,height=280,left=" + e.clientX + ",top=" + e.clientY;
    share_url = createShareUrl(playlist[index]);
    window.open('https://twitter.com/intent/tweet?lang=en&hashtags=nowplaying&url=' + share_url ,"",option);
  });
  // }}}
});
