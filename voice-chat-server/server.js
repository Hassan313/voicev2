const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*',  // Allow all origins
    methods: ['GET', 'POST']
  }
});

app.use(express.static('public'));
app.use(cors());
app.get('/test', (req, res) => {
  console.log('Received request for /test');
  res.send('Server is running');
});

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('signal', (data) => {
    console.log('Signal received:', data);
    socket.broadcast.emit('signal', data);
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

const PORT = process.env.PORT || 5432;
server.listen(PORT,'0.0.0.0',() => {
  console.log(`Server is running on port ${PORT}`);
});
