let socket=io();


const messageForm=document.querySelector("#message-form")
const messageFormInput=messageForm.querySelector('input')
const messageFormButton=messageForm.querySelector('button')
const sidebarTemplate=document.querySelector("#sidebar-template").innerHTML
document.querySelector("#message-form").addEventListener("submit",(e)=>{

    let message=document.querySelector("input").value;
    e.preventDefault();

    //disable

    messageFormButton.setAttribute('disabled','disabled')
    socket.emit("sendMessage",message,(error)=>{
//enable

messageFormButton.removeAttribute('disabled')
messageFormInput.value=""
messageFormInput.focus()
        if(error)
    alert(error);
        else
        console.log("The message was delivered");
    })
})

const messages=document.querySelector("#messages")
const messageTemplate=document.querySelector("#message-template").innerHTML
const urlTemplate=document.querySelector("#location-template").innerHTML

//Options

const {username,room}= Qs.parse(location.search,{ignoreQueryPrefix:true})

autoScroll=()=>{
//New message
const newMessage=messages.lastElementChild

//Height of new message

const newMessageStyles=getComputedStyle(newMessage)
const newMessageMargin=parseInt(newMessageStyles.marginBottom)
const newMessageHeight=newMessage.offsetHeight+newMessageMargin

const visibleHeight= messages.offsetHeight

const containerHeight=messages.scrollHeight

const scrollOffset=messages.scrollTop+visibleHeight

if((containerHeight-newMessageHeight)<=scrollOffset)
messages.scrollTop=messages.scrollHeight

console.log(newMessageMargin);
}
//console.log(username.username);
socket.emit('join',{username,room},(err)=>{

if(err){
    alert(err)
    location.href='/'
}

})
socket.on("location",(location)=>{

    const html=Mustache.render(urlTemplate,{
        username:location.username,
url:location.url,
createdAt:moment(location.createdAt).format('h:mm:a')

    })

    messages.insertAdjacentHTML("beforeend",html)
    autoScroll()
    console.log(location);
})

socket.on("message",(message)=>{


const html=Mustache.render(messageTemplate,{
    username:message.username,
    message:message.text,

    createdAt:moment(message.createdAt).format('h:mm:a')
})

//console.log(message);
messages.insertAdjacentHTML("beforeend",html)
autoScroll()

    //console.log(message);
})


let share=document.querySelector("#send-location")


share.addEventListener("click",()=>{

share.setAttribute('disabled','disabled')
    if(!navigator.geolocation)
    
    return alert("geolocation not supported by your browser")

    navigator.geolocation.getCurrentPosition((pos)=>{
     // console.log(pos.coords.latitude)
        socket.emit("location",pos.coords.latitude,pos.coords.longitude,(ack)=>{


            console.log(ack);
            share.removeAttribute('disabled')
        })

    })
    
})



socket.on("roomData",({room,users})=>{

    const html=Mustache.render(sidebarTemplate,{
        room,users
    })
    document.querySelector(".chat__sidebar").innerHTML=html
  //  console.log(room);
//    console.log(users);
})
