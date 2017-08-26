

const express = require('express');
const app = express();
var _ = require('lodash');
var io = require('socket.io')
var http = require('http');
var { createMessage } = require('./utils/createMessage.js');
const port = process.env.PORT || 3000;
const path = require('path');
var resourceUr  = path.join(__dirname, '../public');
app.use(express.static(resourceUr));

var server = http.createServer(app);
app.get('/', (re, res) => {
    res.sendFile('index.html');
});
var socket_io = io(server);

socket_io.on('connection', function (socket) {
    socket.emit('admin_message', createMessage('Admin','Welcome to chat')); 
    socket.broadcast.emit('chat_team_mssage', createMessage('Admin','New User Joinned'));
    socket.on('createMessage', function(msg, callback){
         socket.broadcast.emit('userMessage', createMessage(msg.from, msg.msg));
         callback();
           
    });
    socket.on('creteBlob', function(msg, callback){
        msg.createdAt = new Date().getTime();
        console.log(Buffer.isBuffer(msg.blobValue));
         socket.broadcast.emit('creteBlob', msg);
         callback();
    });
});

server.listen(port, function(){
    console.log(`running on port ${port}`);
});