window.fbAsyncInit = function() {
  FB.init({
    appId      : '362529413866164', // App ID
    channelUrl : '',//'//WWW.YOUR_DOMAIN.COM/channel.html', // Channel File
    status     : true, // check login status
    cookie     : true, // enable cookies to allow the server to access the session
    xfbml      : true  // parse XFBML
  });
  FB.ui({ 
    method: 'feed',
    name: '名前ってなんだよw',
    caption: 'ここがセリフなのか',
    description: 'ですくりぷしょん',
    link: 'http://soundhook.net/',
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

