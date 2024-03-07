const notify_socket = new WebSocket(
    'ws://'
    + window.location.host
    + '/ws/'
    + 'notify/'
)

notify_socket.onopen = function(e) {
    console.log('COnnected to notifications')
}

notify_socket.onclose = function(e) {
    console.log("Disconnected from notification");
}