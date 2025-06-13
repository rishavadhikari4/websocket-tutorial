const socket = io();
const clientsTotal = document.getElementById('clients-total');
const messageContainer = document.getElementById('message-container')
const nameInput = document.getElementById('name-input');
const messageForm = document.getElementById('message-form');
const messageInput = document.getElementById('message-input');


messageForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    sendMessage();
})

socket.on('clients-total',(data)=>{
    clientsTotal.innerText = `Total clients : ${data}`;
});

socket.on('chat-message',(data)=>{
  addMessageToUi(false,data)
})


function sendMessage(){
    if(messageInput.value==""){
        return;
    }
    const data = {
        name: nameInput.value,
        message:messageInput.value,
        dateTime: new Date()
    }
    socket.emit('message',data);
    addMessageToUi(true,data);
    messageInput.value = '';
}

function addMessageToUi(isOwnMessage, data) {
    clearFeedback(); 
    const li = document.createElement('li');
    li.className = isOwnMessage ? 'message-right' : 'message-left';

    const p = document.createElement('p');
    p.className = 'message';
    p.textContent = data.message;

    const span = document.createElement('span');
    span.textContent = `${data.name} -- ${moment(data.dateTime).fromNow()}`;

    p.appendChild(span);
    li.appendChild(p);
    messageContainer.appendChild(li);
 
    scrollToBottom();
}

function scrollToBottom(){
    messageContainer.scrollTo({
        top: messageContainer.scrollHeight,
        behavior: 'smooth'
    });
}


messageInput.addEventListener('focus',(e) =>{
    socket.emit("feedback",{
        feedback:`${nameInput.value} is typing...`
    });
});

messageInput.addEventListener('keypress',(e) =>{
    socket.emit("feedback",{
        feedback:`${nameInput.value} is typing...`
    });
});

messageInput.addEventListener('blur',(e) =>{
    socket.emit("feedback",{
        feedback:``
    });
});


socket.on('feedback', (data) => {
    clearFeedback(); 

    const li = document.createElement('li');
    li.className = 'message-feedback';

    const p = document.createElement('p');
    p.className = 'feedback';
    p.id = 'feedback';
    p.textContent = data.feedback;

    li.appendChild(p);
    messageContainer.appendChild(li);

    scrollToBottom();
});


function clearFeedback() {
    document.querySelectorAll('li.message-feedback').forEach(element => {
        element.parentNode.removeChild(element);
    });
}
