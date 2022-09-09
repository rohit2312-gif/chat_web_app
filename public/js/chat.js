let socket=io();


let message=document.querySelector("input");
document.querySelector("button").addEventListener("click",(e)=>{
e.preventDefault();

    socket.emit("sendMessage",message.value)
})

socket.on("message",(text)=>{

    console.log(text);
})
socket.on("newconnection",(msg)=>{


    console.log(msg);
})
