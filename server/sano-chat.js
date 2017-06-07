const io = require("socket.io");

function init(session, httpserver, dispatch) {
    const socketio = io(httpserver);

    socketio.use(function(socket, next) {
        session(socket.request, socket.request.res, next);
    });

    socketio.on("connect", function(socket) {
        //console.log(socket.request.session);

        socket.on("chat-send", function(message) {
            socket.broadcast.emit("chat-receive", {
                source: "remote",
                message: message
            });

            socket.emit("chat-receive", {
                source: "self",
                message: message
            })
        });
    });

    console.log("sano-chat ok");
}

module.exports = init;