const express = require('express');
const app = express();
const path = require('path');
const PORT = process.env.PORT || 3000;


app.use(express.static(path.join(__dirname,'public')));


const server = app.listen(PORT,()=>{
    console.log(`The server is running on http://localhost:${PORT}`);
}); 
const io = require('socket.io')(server);

let socketsConnected = new Set()

io.on('connection',onConnected);

function onConnected(socket){
        console.log(socket.id);
        socketsConnected.add(socket.id);

        io.emit('clients-total',socketsConnected.size);

        socket.on('disconnect',()=>{
            console.log('socket disconnected',socket.id);
            socketsConnected.delete(socket.id);
            io.emit('clients-total',socketsConnected.size);
        })

        socket.on('message',(data)=>{
            socket.broadcast.emit('chat-message',data);
        })

        socket.on('feedback',(data)=>{
            socket.broadcast.emit('feedback',data);
        })
    }