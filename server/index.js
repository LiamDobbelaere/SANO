require('dotenv').config();
const shell = require("./sano-shell.js")();
const data = require("./sano-data.js")(shell);
const web = require("./sano-web.js")(data);
const chat = require("./sano-chat")(web.session);

//shell.commands["custom"] = new shell.Command("test", () => shell.term("fuck"));
if (process.env.SANO_SHELL_DISABLE !== "true") shell.prompt();

/*

var hash = bcrypt.hashSync('bacon', 8);

console.log();
console.log(bcrypt.compareSync('bacons', hash));

console.log(hash);*/