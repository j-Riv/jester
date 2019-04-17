module.exports = io => {
    let sockets = [];
    let people = [];
    io.sockets.on('connection', socket => {
        sockets.push(socket);
        // join the server
        const _id = socket.id;
        // game
        console.log('a user connected: ' + _id);
        // on join room
        socket.on('create', function (room) {
            console.log('create this:');
            console.log(room);
            socket.join(room);
        });
        // new user
        socket.on('user connected', function (r) {
            console.log(`new user: ${r.user} socket id: ${socket.id}`);
            console.log(socket.id);
            // check if user exists
            let removed = removeByKey(people, { key: 'user', value: r.user });
            people.push({ socketId: socket.id, user: r.user });
        });
        // leave room
        socket.on('leave room', function (r) {
            console.log(`user: ${r.user} socket id: ${socket.id} has left`);
            let removed = removeByKey(people, { key: 'socketId', value: socket.id });
            sockets.splice(sockets.indexOf(socket), 1);
            // emit remove user
            // socket.in(r.gameId).emit('remove user', { user: r.user });
        });
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
            io.emit('user disconnected', { socketId: _id });
            console.log('Socket disconnected: ' + _id);
        });
    });

}

function removeByKey(array, params) {
    array.some(function (item, index) {
        if (array[index][params.key] === params.value) {
            // found it!
            array.splice(index, 1);
            return true; // stops the loop
        }
        return false;
    });
    return array;
}