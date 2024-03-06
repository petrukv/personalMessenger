const logged_user = JSON.parse(document.getElementById('json-message-username').textContent)

const onlineStatus = new WebSocket(
    'ws://'
    + window.location.host
    + '/ws/'
    + 'online/'
);

onlineStatus.onopen = function(e){
    console.log("CONNECTED TO online");
    onlineStatus.send(JSON.stringify({
        'username': logged_user,
        'type': 'open'
    }))
};

onlineStatus.onerror = function(e){
    console.log("ERROR OCCURRED");
};

onlineStatus.onclose = function(e){
    console.log("DISCONNECTED ");
};

window.addEventListener("beforeunload", function(e){
    onlineStatus.send(JSON.stringify({
        'username': logged_user,
        'type': 'offline'
    }))
})

onlineStatus.onmessage = function(e){
    var data = JSON.parse(e.data)
    if(data.username != logged_user) {
        var user_to_change = document.getElementById(`${data.username}_status`);
        var small_status_to_change = document.getElementById(`${data.username}_small`);
        if (data.online_status == true){
            user_to_change.style.color = 'green';
            small_status_to_change.textContent = 'Online';
        } else {
            user_to_change.style.color = 'grey';
            small_status_to_change.textContent = 'Offline';

        }
    }
}