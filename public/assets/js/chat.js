$(function () {
    var socket = io("http://localhost:3000");

    socket.on("chat-receive", function(message) {
        receiveChatMessage(message.source, message.message);
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