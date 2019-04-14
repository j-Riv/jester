module.exports.respond = socket => {
    // game
    console.log('a user connected');
    // room connection
    socket.on('user joined', function(m) {
        console.log('user: ' + m.newUser+ ' has joined ' + m.room );
        socket.broadcast.emit('user-update-room-' + m.room, m.newUser);
    });
    // chat
    socket.on('client msg', function(msg) {
        console.log('server got new message id: ' + msg.gameId);
        console.log('user: ' + msg.user);
        console.log('msg: ' + msg.message);
        socket.broadcast.emit('msg-' + msg.gameId, msg);
    });

    socket.on('card selected', function(card) {
        console.log('server got card');
        console.log('card user: ' + card.user);
        console.log('card src: ' + card.src);
    });
}