const io = require("socket.io");

function init(session, httpserver, dispatch, data) {
    const socketio = io(httpserver);

    socketio.use(function(socket, next) {
        session(socket.request, socket.request.res, next);
    });

    socketio.on("connect", function(socket) {
        //console.log(socket.request.session);
        let chatid = "";

        data.getAvailableResponderCount().then((count) => {
            socket.emit("available-responders", count);
        });

        socket.on("client-request-ticket", function() {
            let newDispatch = dispatch.requestList.addRequest(socket.id);

            chatid = newDispatch.id;
            socket.join(chatid);

            let exposedData = {
                code: newDispatch.code
            };

            socket.emit("client-receive-ticket", exposedData);
        });

        socket.on("respond-to-ticket", function(id) {
            let disp = dispatch.requestList.getRequestById(id);

            if (typeof(socket.request.session.login) !== "undefined" && disp.answered === false) {
                disp.answer();

                chatid = id;

                socket.join(chatid);
                socketio.in(chatid).emit("display-chat");
                socketio.in(chatid).emit("chat-receive", {
                    source: "server",
                    message: "Check your code: " + disp.code
                });
            }
        });

        socket.on("client-use-ticket", function() {
            let dispatchRequest = dispatch.requestList.getRequestBySocketId(socket.id);

            if (dispatchRequest !== null && dispatchRequest.started === false) {
                dispatchRequest.start();

                socket.emit("update-timeleft", dispatch.waitTime);

                //Allow escalation
                setTimeout(function() {
                    dispatchRequest.allowEscalate();
                    socket.emit("client-allow-escalate");
                }, dispatch.waitTime * 1000)

                //Started dispatch here
            }
        });

        socket.on("chat-send", function(message) {
            socket.broadcast.to(chatid).emit("chat-receive", {
                source: "remote",
                message: message
            });

            socket.emit("chat-receive", {
                source: "self",
                message: message
            })
        });

        socket.on("disconnect", function() {
            dispatch.requestList.removeRequestBySocketId(socket.id);

            socketio.in(chatid).emit("chat-receive", {
                source: "server",
                message: "The other person has disconnected."
            });
        });
    });

    console.log("sano-chat ok");
}

module.exports = init;