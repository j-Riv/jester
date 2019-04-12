module.exports.respond = socket => {
    // game
    console.log('a user connected');

    socket.on('client msg', function (msg) {
        console.log('server got new message id: ' + msg.gameId);
        emitMsg(socket, msg);
    });

    // io.sockets.clients
    const emitMsg = (socket, msg) => {
        console.log('user: ' + msg.user);
        console.log('msg: ' + msg.message);
        socket.broadcast.emit('msg-' + msg.gameId, msg);
    }
}