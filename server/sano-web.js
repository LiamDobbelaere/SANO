const fs = require("fs");
const path = require("path");
const express = require("express");
const logger = require("morgan");

const app = express();
const server = require("http").Server(app);
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);
const sessionStore = new MySQLStore({
    host: process.env.SANO_DATA_IP,
    port: process.env.SANO_DATA_PORT,
    database: process.env.SANO_DATA_DB,
    user: process.env.SANO_DATA_USER,
    password: process.env.SANO_DATA_PW,
    checkExpirationInterval: 900000,
    expiration: 86400000,
    createDatabaseTable: true,
    connectionLimit: 20,
    schema: {
        tableName: 'sessions',
        columnNames: {
            session_id: 'session_id',
            expires: 'expires',
            data: 'data'
        }
    }
});

let sessionFinal = session({
    key: process.env.SANO_WEB_SESSIONKEY,
    secret: process.env.SANO_WEB_SESSIONSECRET,
    store: sessionStore,
    resave: true,
    saveUninitialized: true
});

const bodyParser = require('body-parser');
const appTitle = "SANO";

function init(data) {
    server.listen(80);

    let accessLogStream = fs.createWriteStream(path.join(__dirname, '/../express.log'), {flags: 'a'});

    app.use(sessionFinal);

    app.set("view engine", "ejs");
    app.set("views", __dirname + "/../views");
    app.use(express.static(__dirname + "/../public"));
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(logger("combined", {stream: accessLogStream}));

    app.get("/", function (req, res) {
        res.render("index", {
            title: appTitle
        });
    });

    //Todo: make login filter more abstract
    app.get("/chat", function (req, res) {
        if (req.session.login) {
            res.render("chat", {
                title: appTitle
            });
        } else {
            res.redirect("/");
        }
    });

    app.post("/login.do", function (req, res) {
        data.validateUser({
            login: req.body.username,
            password: req.body.password
        }).then(() => {
            req.session.login = req.body.username;
            res.redirect("/chat");
        }).catch((err) => {
            console.log(err);
            res.redirect("/");
        });
    });

    app.get("/logout.do", function (req, res) {
        delete req.session.login;
        res.redirect("/");
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

    console.log("sano-web ok");

    return {
        session: sessionFinal
    }
}

module.exports = init;