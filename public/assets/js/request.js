$(function () {
    var socket = io();

    socket.on("connect", function() {
        console.log("Socket connected!");

        socket.emit("client-request-ticket");
    });

    socket.on("chat-receive", function(message) {
        receiveChatMessage(message.source, message.message);
    });

    socket.on("client-receive-ticket", function(data) {
        $("#dispatch-code").text(data.code);
        $("#dispatch-button").fadeIn(500);
    });

    scrollToBottom();
    /*setInterval(function() {
     if (Math.random() < 0.5) {
     receiveChatMessage("self", "Sample response");
     } else {
     receiveChatMessage("remote", "Sample other talking");
     }
     }, 1000);*/

    $("#chat-input-mobile").on("keypress", function(e) {
        if (e.which === 13) {
            socket.emit("chat-send", $(this).val());
            $(this).val("");
        }
    })
});

function scrollToBottom() {
    $('html, body').animate({
            scrollTop: $(document).height() - $(window).height()
        },
        200,
        "easeInOutQuint"
    );
}

function receiveChatMessage(source, content) {
    $newLi = $("<li></li>");
    $newLi.addClass(source);
    $newLi.text(content);

    var direction = "left";
    if (source === "self") direction = "right";

    $newLi.hide().appendTo("#chat ul").toggle("drop", {
        direction: direction
    }, 200);

    scrollToBottom();
}