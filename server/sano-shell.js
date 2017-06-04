const term = require("terminal-kit").terminal;
let commands = {};
let firstTime = true;

term.on("key", function (name, matches, data) {
    if (name === "CTRL_C" || name === "CTRL_Z" || name === "CTRL_D") {
        term("\n");
        term.brightWhite("%s detected, quitting!", name.replace("_", "-"));
        term("\n");
        process.exit(0);
    }
});

function Command(info, func) {
    this.info = info;
    this.func = func;
}

function init() {
    console.log("sano-shell ok");

    return {
        Command: Command,
        commands: commands,
        term: term,
        prompt: prompt
    }
}

function prompt() {
    if (firstTime) {
        term.clear();
        term.brightGreen("SANO system console\n");
        term.brightWhite("Use TAB at any time for possible commands\n");

        firstTime = false;
    }

    term("\n");
    term.brightGreen("sano").brightWhite("> ");
    term.inputField({
            autoComplete: Object.keys(commands),
            autoCompleteMenu: {
                style: term.black.brightWhite,
                selectedStyle: term.brightWhite.bgGreen
            }
        },
        (error, input) => {
            term("\n");
            parse(input, prompt);
        }
    );
}

function parse(input, donefunc) {
    if (typeof(input) === "undefined") return;

    let parameters = input.split(" ");
    let command = parameters.shift();

    if (command in commands) {
        commands[command].func(parameters, donefunc);
    } else {
        term("Command '%s' not found.", input);
        donefunc();
    }
}

//Default built-in shell commands
commands["help"] = new Command("Displays this list", (par, done) => {
    Object.keys(commands).forEach(function (key) {
        let command = commands[key];

        term("%s - %s\n", key, command.info);
    });

    done();
});

commands["exit"] = new Command("Terminates the application", (par, done) => {
    process.exit(0);
});

module.exports = init;