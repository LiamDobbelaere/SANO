const fs = require("fs");
const path = require("path");
const express = require("express");
const logger = require("morgan");

const app = express();
const server = require("http").Server(app);
const session = require("express-session");
let shell = null;

function init(sh) {
    shell = sh;

    server.listen(80);

    let accessLogStream = fs.createWriteStream(path.join(__dirname, '/../express.log'), {flags: 'a'});
    app.use(logger("combined", {stream: accessLogStream}));

    app.use(session({
        secret: 'I+_7d9DqJt@"$Bi-!yr,SxuVqx.|B',
        resave: false,
        saveUninitialized: true
    }));

    /*app.get("*", function (req, res, next) {
     console.log(req.session.user);
     if (!req.session.user) {
     req.session.user = "digaly";
     res.send("Aw heck, you're not logged in!");
     } else {
     next();
     }
     });*/

    app.use(express.static(__dirname + "/../public"));


}

module.exports = init;