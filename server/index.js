require('dotenv').config();
const shell = require("./sano-shell.js")();
const data = require("./sano-data.js")(shell);
const discord = require("./sano-discord.js")();
const dispatch = require("./sano-dispatch")(data, shell, discord);
const web = require("./sano-web.js")(data, dispatch);
const chat = require("./sano-chat")(web.session, web.httpserver, dispatch, data);

//shell.commands["custom"] = new shell.Command("test", () => shell.term("fuck"));
if (process.env.SANO_SHELL_DISABLE !== "true") {
    console.log("Starting shell in 5 seconds...");
    setTimeout(shell.prompt, 5000);
}

/*

var hash = bcrypt.hashSync('bacon', 8);

console.log();
console.log(bcrypt.compareSync('bacons', hash));

console.log(hash);*/