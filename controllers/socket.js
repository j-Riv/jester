module.exports.respond = socket => {
    // game

    socket.on('new message', function (msg) {
        console.log('server got new message id: ' + msg.gameId);
        console.log('user: ' + msg.user);
        console.log('msg: ' + msg.message);
        // socket.broadcast.to(msg.gameId).emit('new bc message', msg);
        // socket.in(msg.gameId).emit('new bc message', msg);
        socket.emit('new message', msg)
    });
}