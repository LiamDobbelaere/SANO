const shell = require("./sano-shell.js")();
const web = require("./sano-web.js")();

shell.commands["custom"] = new shell.Command("test", () => shell.term("fuck"));

shell.prompt();

/*
const bcrypt = require('bcryptjs');

var hash = bcrypt.hashSync('bacon', 8);

console.log(bcrypt.compareSync('bacon', hash));
console.log(bcrypt.compareSync('bacons', hash));

console.log(hash);*/