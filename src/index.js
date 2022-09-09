const express=require('express')

const bodyparser=require("body-parser");
const e = require('express');
const http=require('http')
const path=require('path')
const socket=require('socket.io')
const app=express()
const server=http.createServer(app)
const io=socket(server)
app.use(bodyparser.urlencoded({extended:true}));

const publicDirectory=path.join(__dirname,'../public')
console.log(publicDirectory);
app.use(express.static(publicDirectory));


//app.set()
//app.use(express.json)


io.on('connection',(socket)=>{


    socket.emit("message","welcome");

    socket.broadcast.emit("message","a new user has joined")

    socket.on("sendMessage",(text)=>{
        
        socket.emit("message",text)
    }
    )
    socket.on("disconnect",()=>{

        io.emit("message","A user has left")
    })
//    socket.

    console.log("New Websocket connection");
})


server.listen(4000,function(){

    console.log("server running on port 4000");
})
