const express = require('express');

const app = express();
// const cors = require('cors')
// app.use(cors())
const server = require('http').Server(app);
const io = require('socket.io')(server);
const { ExpressPeerServer } = require('peer');

const peerServer = ExpressPeerServer(server, {
  debug: true,
});

// Create a unique room uuid
const { v4: uuidV4 } = require('uuid');

app.use('/peerjs', peerServer);

// Connect ejs in frontend
app.set('view engine', 'ejs');
app.use(express.static('public'));

// generates a uuid after routing
app.get('/', (req, res) => {
  res.redirect(`/${uuidV4()}`);
});

// Create a room and give it a room param with the uuid
app.get('/:room', (req, res) => {
  res.render('room', { roomId: req.params.room });
});

// When connecting, user joins a shared room
io.on('connection', (socket) => {
  socket.on('join-room', (roomId, userId) => {
    socket.join(roomId);
    socket.to(roomId).broadcast.emit('user-connected', userId);
    // messages
    socket.on('message', (message) => {
      // send message to the same room
      io.to(roomId).emit('createMessage', message);
    });

    // User disconnect
    socket.on('disconnect', () => {
      socket.to(roomId).broadcast.emit('user-disconnected', userId);
    });
  });
});

server.listen(process.env.PORT || 3030);
