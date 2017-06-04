const io = require("socket.io");
const socketio = io.listen(3000);

function init(session) {
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