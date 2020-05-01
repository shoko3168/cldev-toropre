var toropre = (function() {
  // var socket = io('http://160.16.79.8:8086');
  var socket = io('https://toronodejs.azurewebsites.net/');
  socket.on('connect', function() {
    socket.emit('setup', {});
    onSlideChanged(Reveal.getCurrentSlide());
  });
  socket.on('userconnect', userconnect);
  socket.on('runComment', runComment);

  function onSlideChanged(slide) {
    var slideChangeParam = {
      type: 'default'
    };
    var lineLastPage = Reveal.getCurrentSlide().getAttribute('data-linebotlastpage');
    var sendUrl = Reveal.getCurrentSlide().getAttribute('data-sendurl');
    var sendPicUrl = Reveal.getCurrentSlide().getAttribute('data-sendpic');
    if (lineLastPage) {
      slideChangeParam = {
        type: 'sendlinebotlastpage'
      };
      socket.emit('slidechanged', slideChangeParam);
    } else if (sendUrl) {
      var sendUrlText = Reveal.getCurrentSlide().getAttribute('data-sendurltext') || '';
      var sendUrlImg = Reveal.getCurrentSlide().getAttribute('data-sendurlimg') || 'https://scdn.line-apps.com/n/line_add_friends/btn/ja.png';
      console.log('===socketemit sendUrl===');
      console.log('url=' + sendUrl);
      slideChangeParam = {
        type: 'sendurl'
        , url: sendUrl
        , text: sendUrlText
        , img: sendUrlImg
      };
      socket.emit('slidechanged', slideChangeParam);
    } else if (sendPicUrl) {
      console.log('===socketemit sendPic===');
      console.log('url=' + sendPicUrl);
      slideChangeParam = {
        type: 'sendpic'
        , url: sendPicUrl
      };
      socket.emit('slidechanged', slideChangeParam);
    } else {
      console.log('===socketemit2===');
      socket.emit('slidechanged', slideChangeParam);
    }
  }
  Reveal.addEventListener('slidechanged', function(event) {
    onSlideChanged(event.currentSlide);
  });
  function userconnect(data) {
    var cntEl = document.getElementById('player_cnt');
    if (data && cntEl) {
      cntEl.innerText = data['usercount'];
    }
  }
  function runComment(data) {
    console.log('runComment start');
    console.log(data);
    var LIMIT = 100;
    var comment = data.comment;
    if (comment) {
      var commentp = document.createElement('p');
      var targetEl = document.getElementById('toropre');
      if (targetEl) {
        // 0 - 90
        var top = (Math.random() * 90) + '%';
        commentp.style['top'] = top;


        if (comment.length > LIMIT) {
          comment = comment.substr(0, LIMIT) + '【…省略】';
          commentp.style['animation-duration'] = '3s';
        }
        if (comment === 'ｷﾀ━(ﾟ∀ﾟ)━ｯ!!') {
          commentp.style['color'] = '#EE6557';
          commentp.style['animation-duration'] = (Math.floor(Math.random() * 3) + 1) + 's';
        } else if (comment === '88888888') {
          var pachiColors = ['#FFFFFF', '#FFD464', '#F26964', '#1253A4'];
          commentp.style['color'] = pachiColors[Math.floor(Math.random() * pachiColors.length)];
        } else {
          var pachiColors = ['#0000cd', '#006400', '#ff8c00', '#ff1493'];
          commentp.style['color'] = pachiColors[Math.floor(Math.random() * pachiColors.length)];
        }
        commentp.textContent = comment;
        targetEl.appendChild(commentp);
        var now = new Date();
        var ym = now.getHours() + ':' + now.getMinutes();
        console.log(ym + " - " + comment);
      }
    }
  }
  return {};
})();
