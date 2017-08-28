

const express = require('express');
const app = express();
var _ = require('lodash');
var io = require('socket.io')
var http = require('http');
var formidable = require('formidable');
var { createMessage } = require('./utils/createMessage.js');
var { isRealString } = require('./utils/validation.js');
const port = process.env.PORT || 3000;
const bodyParser = require('body-parser');
const cookieparser = require('cookie-parser');
const path = require('path');
var resourceUr  = path.join(__dirname, '../public');
app.use(express.static(resourceUr));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }));
var { Users }  = require('./utils/user.js');
//app.use(.cookieparser());

var server = http.createServer(app);
app.get('/', (re, res) => {
    res.sendFile('index.html');
});
var socket_io = io(server);
 var users = new Users();
var room;
var user;
app.post('/upload', function(req, res){
     var form = new formidable.IncomingForm();
     form.on('file', function(field, file) {
        console.log(file);
    });
     //socket_io.emit('userMessage', createMessage('prateek','how are u'));
   // res.send('hello');
});

socket_io.on('connection', function (socket) {
   
    socket.on('join', function(params, callback){
      
        if(isRealString(params.name) && isRealString(params.room)){
            socket.join(params.room);
            users.removeuser(socket.id);
            users.addUser(socket.id, params.name, params.room);
            socket_io.to(params.room).emit('updateUser', users.getUserList(params.room));
            
            socket.emit('admin_message', createMessage('Admin','Welcome to chat')); 
            socket.broadcast.to(params.room).emit('chat_team_mssage', createMessage('Admin', `${params.name} has joined`));
           
            
        }else{
            callback('Value is not proper');
        }
      
    });

    socket.on('createMessage', function(msg, callback){
         var user = users.getUser(socket.id);
         console.log(user);
         socket.broadcast.to(user[0].room).emit('userMessage', createMessage(msg.from, msg.msg));
         callback();
           
    });
    socket.on('creteBlob', function(msg, callback){
        msg.createdAt = new Date().getTime();
        socket.broadcast.to(room).emit('creteBlob', msg);
        
    });
    socket.on('disconnect', function(){
        var user = users.removeuser(socket.id);
        if(user){
             socket_io.to(user.room).emit('updateUser', users.getUserList(user.room));
             socket_io.to(user.room).emit('admin_message', createMessage('Admin', `${user.name} has left the ${user.room}`));
            
        }
       
    });

});

server.listen(port, function(){
    console.log(`running on port ${port}`);
});