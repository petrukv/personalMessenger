const onlineStatusSocket = new WebSocket(
    'ws://'
    + window.location.host
    + '/ws/'
    + 'online/'
);

onlineStatusSocket.onopen = function(e){
    console.log("CONNECTED TO online");
};

onlineStatusSocket.onerror = function(e){
    console.log("ERROR OCCURRED");
};

onlineStatusSocket.onclose = function(e){
    console.log("DISCONNECTED ");
};
