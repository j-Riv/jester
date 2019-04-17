module.exports = io => {
    // // game
    // console.log('a user connected');
    // // room connection
    // socket.on('user joined', function(m) {
    //     console.log('user: ' + m.newUser+ ' has joined ' + m.room );
    //     socket.broadcast.emit('user-update-room-' + m.room, m.newUser);
    // });
    // // chat
    // socket.on('client msg', function(msg) {
    //     console.log('server got new message id: ' + msg.gameId);
    //     console.log('user: ' + msg.user);
    //     console.log('msg: ' + msg.message);
    //     socket.broadcast.emit('msg-' + msg.gameId, msg);
    // });

    // socket.on('card selected', function(card) {
    //     console.log('server got card');
    //     console.log('card user: ' + card.user);
    //     console.log('card src: ' + card.src);
    // });
    io.on('connection', socket => {
        // game
        console.log('a user connected');
        // on join room
        socket.on('create', function (room) {
            console.log('create this:');
            console.log(room);
            socket.join(room);
        });
        // new user
        // socket.on('new user', function (room) {
        //     console.log(`new user: ${room.user} adding to room: ${room.gameId}`);
        //     socket.in(room.gameId).emit('Update Users', { user: room.user, wins: 0 });
        // });
        // chat
        socket.on('client msg', function (msg) {
            console.log('server got new message id: ' + msg.gameId);
            console.log('user: ' + msg.user);
            console.log('msg: ' + msg.message);
            socket.in(msg.gameId).emit('new chat', msg);
        });
        // disconnect
        socket.on('disconnect', function (response) {
            console.log(response);
            console.log(`${response} has disconnected.`);
            // console.log(`${response.user} has disconnected.`);
            // socket.in(response.id).emit('Remove Users', { user: response.user });
        });
    });

}