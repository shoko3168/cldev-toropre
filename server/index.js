const http = require('http');
var connect = require('connect');
var fs = require('fs');
var cookie = require('cookie');
require('date-utils');

var server = http.createServer();

// loginしたユーザ
var userMap = {};
var masterId = null;

server.on('request', function(req, res) {
    var stream = fs.createReadStream('index.html');
    res.writeHead(200, {
        'Content-Type': 'text/html'
    });
    stream.pipe(res);
});

var io = require('socket.io').listen(server);
io.sockets.on('connection', function(socket_client) {
    function debuglog(str) {
        var dt = new Date();
        var formatted = dt.toFormat('YYYY-MM-DD HH24:MI:SS');
        console.log('[' + formatted + '] [' + socket_client.id + ']' + str);
    }
    debuglog('==connection==' + socket_client.id);
    // Master only
    socket_client.on('setup', function(data) {
        debuglog('masterLogin');
        debuglog('MASTER=' + socket_client.id);
        masterId = socket_client.id;
    });
    socket_client.on('login', function(id) {
        debuglog('login' + id);
        var user = {
            id: id,
            socket_id: socket_client.id
        };
        if (userMap[id]) {
            user = userMap[id];
        } else {
            user.name = '名無し';
            userMap[id] = user;
        }
    });
    socket_client.on('saveUserName', function(user) {
        debuglog('saveUserName[id=' + user.id + ', name=' + user.name + ']');
        if (userMap[user.id]) {
            userMap[user.id]['name'] = user.name;
        } else {
            userMap[user.id] = {
                'id': user.id,
                'name': user.name
            };
        }
    });
    socket_client.on('runComment', function(param) {
        debuglog('runComment: ' + param.id + ': ' + param.comment);
        if (masterId) {
            io.to(masterId).emit('runComment', {
                comment: param.comment
            });
        }
    });
    socket_client.on('slidechanged', function(slideChangeParam) {
        debuglog('slidechanged: ');
        io.emit('slidechanged', slideChangeParam);
    })
});


const port = process.env.PORT || 443;
server.listen(port);

console.log("Server running at http://localhost:%d", port);
