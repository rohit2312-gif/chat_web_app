const express=require('express')

const bodyparser=require("body-parser");
//const e = require('express');
const Filter=require('bad-words')
const http=require('http')
const path=require('path')
const socket=require('socket.io')
const app=express()
const {generateMessage,generateLocation}=require('./utils/messages')
const server=http.createServer(app)
const io=socket(server)
const {addUser,removeUser,getUser,getUsersInRoom}=require('./utils/users');
const { error } = require('console');
app.use(bodyparser.urlencoded({extended:true}));

const publicDirectory=path.join(__dirname,'../public')
console.log(publicDirectory);
app.use(express.static(publicDirectory));


//app.set()
//app.use(express.json)


io.on('connection',(socket)=>{


  
    socket.on('join',({username,room},callback)=>{
    const {error,user}=addUser({id:socket.id,username,room})
           
        console.log(user);
        if(error){
            return callback(error)
        }    

        socket.join(user.room)
            

        socket.emit("message",generateMessage("Admin","Welcome"));
        io.to(user.room).emit("roomData",{
            room:user.room,
            users:getUsersInRoom(user.room)
        })

        socket.broadcast.to(user.room).emit("message",generateMessage(user.username,`${user.username} has joined`))
    callback()
    })
    socket.on("sendMessage",(text,callback)=>{
 //       d
        
        const user=getUser(socket.id)

        const filter=new Filter()

        if(filter.isProfane(text)){
     return callback("Profanity is not allowed")
        }
        io.to(user.room).emit("message",generateMessage(user.username,text))
        callback(null)
    }
    )
    socket.on("location",(lat,lon,callback)=>{

        const user=getUser(socket.id)

        io.to(user.room).emit('location',generateLocation(user.username,`https://google.com/maps?q=${lat},${lon}`))
        callback("Location shared")
    
    })
    socket.on("disconnect",()=>{


        const user=removeUser(socket.id)


        if(user){

            io.to(user.room).emit("message",generateMessage(`${user.username} has left!`))
        io.to(user.room).emit('roomData',{
            room:user.room,
            users:getUsersInRoom(user.room)
        })
        }

       
    })

//    socket.

    console.log("New Websocket connection");
})


server.listen(4000,function(){

    console.log("server running on port 4000");
})
