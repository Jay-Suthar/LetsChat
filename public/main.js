const formChat = document.getElementById('form-chat');
const chatBlocks = document.getElementById('main-box');
const roomnames = document.getElementById('room_name')
const user_names = document.getElementsByClassName("list-group");

//get username and url from url
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

console.log(username, room);

const socket = io();

socket.emit('joinRoom', { username, room });


//get room and users
socket.on('user_room', ({ room, users }) => {
    display_room_name(room);
    display_users(users);
});

// message from server 
socket.on('message', message => {
    console.log(message);
    outputMssg(message);

    //scroll down
    chatBlocks.scrollTop = chatBlocks.scrollHeight;
});


//message submit
formChat.addEventListener('submit', (e) => {
    e.preventDefault();

    //getting message from client
    const msg = e.target.elements.msg.value;

    //emit message to the server
    socket.emit('chatMessage', msg);

    //Clear input 
    e.target.elements.msg.value = "";
    e.target.elements.msg.focus();
});

function outputMssg(message) {
    const div = document.createElement('div');
    div.classList.add('mssg');
    div.innerHTML = `<div class="card-body mssg-body">
    <h6 class="card-subtitle mb-2 text-muted">
        <span class="name-of-user">${message.username}:</span>   ${message.time}
    </h6>
    <p class="card-text">${message.text}</p>
</div>`;
    document.getElementById('chat-blocks').appendChild(div);
}



// add room name 
function display_room_name(room) {
    roomnames.innerText = room;
}

function display_users(users) {
    user_names[0].innerHTML = `
    ${users.map(user => `<li class="list-group-item" style="    background-color: transparent;
    color: azure;
    border-color: transparent;">${user.username}</li>`).join('')}
    `;
}