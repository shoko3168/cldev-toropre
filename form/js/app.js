var socket = io('https://example.azurewebsites.net');

// userId
var userId = '';
if (localStorage.userId) {
  userId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
		return v.toString(16).toUpperCase();
  });
  localStorage.userId = userId;
}
socket.on('connect', function() {
  socket.emit('login', userId);
});

var clearComment = function(num) {
  document.getElementById('comment' + num).value = '';
};
var runComment = function(num) {
  console.log('runComment start:' + num);
  var commentVal = document.getElementById('comment' + num).value;
  sendComment(commentVal);
};
var sendComment = function(commentVal) {
  if (commentVal) {
    if (commentVal.length < 120) {
      socket.emit('runComment', {id: userId, comment: commentVal});
    } else {
      socket.emit('runComment', {id: userId, comment: commentVal.substr(0, 120)});
      clearComment(num);
      alert('長いのでちょっと切りました(´・ω・｀)');
    }
  } else {
    alert('入力してください');
  }
};

var comment1 = document.createElement('input');
comment1.setAttribute('id', 'comment1');
comment1.setAttribute('type', 'text');
comment1.setAttribute('style', 'size="140px;"');
comment1.setAttribute('value', '(･ω･)');
var runComment1 = document.createElement('input');
runComment1.setAttribute('type', 'button');
runComment1.setAttribute('value', '送信');
runComment1.setAttribute('onclick', 'runComment(1);');
var clearComment1 = document.createElement('input');
clearComment1.setAttribute('type', 'button');
clearComment1.setAttribute('value', 'クリア');
clearComment1.setAttribute('onclick', 'clearComment(1);');

document.body.appendChild(comment1);
document.body.appendChild(runComment1);
document.body.appendChild(clearComment1);

var template = ['( ﾟдﾟ )ﾎｩ', 'ｷﾀ━(ﾟ∀ﾟ)━ｯ!!', 'あるあるｗ', '(ﾟДﾟ;)ｴｯ!?'];
if (template.length > 0) {
  document.body.appendChild(document.createElement('br'));
  for (var i = 0; i < template.length; i++) {
    var aruaru = document.createElement('input');
    aruaru.setAttribute('type', 'button');
    aruaru.setAttribute('value', template[i]);
    aruaru.setAttribute('onclick', 'sendComment("' + template[i] + '");');
    document.body.appendChild(aruaru);
  }
}

socket.on('slidechanged', function(data) {
  console.log('===slidechanged===');
  console.log(data);
  if (!data) return;
});
