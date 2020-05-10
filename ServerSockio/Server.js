const io = require('socket.io')(8080)

io.on('connection', socket => {
    socket.on('message', message => {
        socket.emit('message', message)
    });
});