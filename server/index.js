require('dotenv').config();
const shell = require("./sano-shell.js")();
const data = require("./sano-data.js")();
const web = require("./sano-web.js")();

data.validateUser({
    login: "newguy",
    password: "newpwd"
}).then(console.log);

/*data.addUser({
    login: "abcdef",
    password: "abcdef",
}).then(val => console.log(val))
    .catch(err => console.log(err));*/

//shell.commands["custom"] = new shell.Command("test", () => shell.term("fuck"));
//shell.prompt();

/*

var hash = bcrypt.hashSync('bacon', 8);

console.log();
console.log(bcrypt.compareSync('bacons', hash));

console.log(hash);*/