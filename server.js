const { Socket } = require('dgram');
const express = require('express');
const http = require('http');
const path = require('path');
const socketio = require('socket.io');
const formatMssg = require('./utility/message');
const { user_join, the_cur_user, user_leave, get_room_users } = require('./utility/users');
const app = express();
const server = http.createServer(app);
const io = socketio(server);

const PORT = 3000 || process.env.PORT;
const bot = 'ChatBot';
app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', socket => {
    // console.log("new WS connection");

    //join room
    socket.on('joinRoom', ({ username, room }) => {

        const user = user_join(socket.id, username, room);
        socket.join(user.room);

        //welcome current user 
        // socket.emit('message','welcome to chatChord');
        socket.emit('message', formatMssg(bot, 'welcome to LetsChat'));


        //broadcast ahen a user join/connects to a specific room
        socket.broadcast.to(user.room).emit('message', formatMssg(bot, `${user.username} joined the chat`));

        //sendind users and room information
        io.to(user.room).emit('user_room', {
            room: user.room,
            users: get_room_users(user.room)
        });
    });

    //listen for chatMessage
    socket.on('chatMessage', msg => {
        const user = the_cur_user(socket.id);
        io.to(user.room).emit('message', formatMssg(user.username, msg));
    });

    //runs when someone disconnects
    socket.on('disconnect', () => {
        const user = user_leave(socket.id);
        if (user) {
            io.to(user.room).emit('message', formatMssg(bot, `${user.username} has disconnected.`));
        }

        //sending users and room information
        io.to(user.room).emit('user_room', {
            room: user.room,
            users: get_room_users(user.room)
        });
    });

});

server.listen(PORT, () => {
    console.log(`server is listening at port ${PORT}`)
});