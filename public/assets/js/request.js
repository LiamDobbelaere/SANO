$(function () {
    initSocketIO();
    scrollToBottom();
    /*setInterval(function() {
     if (Math.random() < 0.5) {
     receiveChatMessage("self", "Sample response");
     } else {
     receiveChatMessage("remote", "Sample other talking");
     }
     }, 1000);*/
});

function initSocketIO() {
    var socket = io();

    socket.on("connect", function() {
        console.log("Socket connected!");

        if (typeof(respondingId) === "undefined") {
            socket.emit("client-request-ticket");
        }
    });

    socket.on("chat-receive", function(message) {
        receiveChatMessage(message.source, message.message);
    });

    socket.on("client-receive-ticket", function(data) {
        $("#dispatch-code").text(data.code);
        $("#dispatch-button").fadeIn(500);
    });

    socket.on("client-allow-escalate", function() {
        $("#dispatch-button").removeClass("disabled").addClass("escalate").text("Escalate");
    });

    socket.on("update-timeleft", function(time) {
        $("#dispatch-status").text("Contacted responders, please wait..");

        var $bar = $("#dispatch-progress").find(".bar");

        $bar.css("width", "100%");
        $bar.css("transition", "width " + time + "s linear");
        $bar.css("width", "0%");
    });

    $("#dispatch-button").on("click", function() {
        socket.emit("client-use-ticket");
        $(this).addClass("disabled");
    });

    if (typeof(respondingId) !== "undefined") {
        socket.emit("respond-to-ticket", respondingId);
    }

    socket.on("display-chat", function() {
        $("#dispatch").hide();
        $("#chat").show();
        $("#chat-input-mobile").show();
    });

    socket.on("available-responders", function(count) {
        if (count > 0) {
            $("#dispatch-available").find(".dot-status").addClass("online");
        } else {
            $("#dispatch-available").find(".dot-status").addClass("offline");
        }

        $("#dispatch-available").find(".content").text(count + " responder(s) available");
    });

    $("#chat-input-mobile").on("keypress", function(e) {
        if (e.which === 13) {
            socket.emit("chat-send", $(this).val());
            $(this).val("");
        }
    })
}

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