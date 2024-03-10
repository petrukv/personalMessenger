const id = JSON.parse(document.getElementById('json-username').textContent);
const message_username = JSON.parse(document.getElementById('json-message-username').textContent);
const receiver = JSON.parse(document.getElementById('json-username-receiver').textContent);

// Функція для відправки повідомлення на сервер через WebSocket
function sendMessage(message) {
    socket.send(JSON.stringify({
        'message': message,
        'username': message_username,
        'receiver': receiver
    }));
}

// Прослуховування подій клікання по кнопці "Submit"
document.querySelector('#chat-message-submit').onclick = function (e) {
    const messageInput = document.querySelector('#message_input');
    const message = messageInput.value.trim();

    if (message !== '') {
        sendMessage(message);
        messageInput.value = '';
    }
};

// Прослуховування подій клавіші "Enter" на полі введення повідомлення
messageInput.addEventListener('keyup', function (event) {
    if (event.key === 'Enter') {
        event.preventDefault();

        const message = messageInput.value.trim();
        if (message !== '') {
            sendMessage(message);
            messageInput.value = '';
        }
    }
});

const socket = new WebSocket(
    'ws://'
    + window.location.host
    + '/ws/'
    + id
    + '/'
);

socket.onopen = function(e){
    console.log("CONNECTed to chat");
}

socket.onclose = function(e){
    console.log("CONNECTION LOST");
}

socket.onerror = function(e){
    console.log("ERROR");
}

socket.onmessage = function(e){
    const data = JSON.parse(e.data);
    const chatBody = document.getElementById('chat-body');
    if (chatBody) {
        if(data.username === message_username){
            chatBody.innerHTML += `<tr>
                                        <td>
                                        <p class="bg-success p-2 mt-2 mr-5 shadow-sm text-white float-right rounded">${data.message}</p>
                                        </td>
                                    </tr>`;
        }else{
            chatBody.innerHTML += `<tr>
                                        <td>
                                        <p class="bg-primary p-2 mt-2 mr-5 shadow-sm text-white float-left rounded">${data.message}</p>
                                        </td>
                                    </tr>`;
        }
        // Прокрутка до найновіших повідомлень після отримання нового повідомлення
        scrollToLatestMessage();
    }
};

// Прокрутка до найновіших повідомлень
function scrollToLatestMessage() {
    const chatBody = document.getElementById('chat-body');
    if (chatBody) {
        chatBody.scrollTop = chatBody.scrollHeight;
    }
}

// Прокрутка до найновіших повідомлень після завантаження сторінки
window.addEventListener('load', function () {
    scrollToLatestMessage();
});
