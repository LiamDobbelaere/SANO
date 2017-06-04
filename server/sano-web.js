const fs = require("fs");
const path = require("path");
const express = require("express");
const logger = require("morgan");

const app = express();
const server = require("http").Server(app);
const session = require("express-session");

const appTitle = "SANO";

function init() {
    server.listen(80);

    let accessLogStream = fs.createWriteStream(path.join(__dirname, '/../express.log'), {flags: 'a'});

    app.use(session({
        secret: process.env.SANO_WEB_SESSIONSECRET,
        resave: false,
        saveUninitialized: true
    }));

    app.set("view engine", "ejs");
    app.set("views", __dirname + "/../views");
    app.use(express.static(__dirname + "/../public"));
    app.use(logger("combined", {stream: accessLogStream}));

    app.get("/", function (req, res) {
        res.render("index", {
            title: appTitle
        });
    });

    /*app.get("*", function (req, res, next) {
     console.log(req.session.user);
     if (!req.session.user) {
     req.session.user = "digaly";
     res.send("Aw heck, you're not logged in!");
     } else {
     next();
     }
     });*/
}

module.exports = init;