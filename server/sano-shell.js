const term = require("terminal-kit").terminal;
let commands = {};

function Command(info, func) {
    this.info = info;
    this.func = func;
}

commands["help"] = new Command("Displays this list", (p) => {
    Object.keys(commands).forEach(function(key) {
        let command = commands[key];

        term("%s - %s\n", key, command.info);
    });
});

commands["exit"] = new Command("Terminates the application", () => {
    process.exit(0);
});

function init() {
    term.clear();
    term.brightGreen("SANO system console\n");
    term.brightWhite("Use TAB at any time for possible commands\n");

    return {
        Command: Command,
        commands: commands,
        term: term,
        prompt: prompt
    }
}

function prompt() {
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
            parse(input);
            prompt();
        }
    );
}

function parse(input) {
    if (typeof(input) === "undefined") return;

    let parameters = input.split(" ");
    let command = parameters.shift();

    if (command in commands) {
        commands[command].func(parameters);
    } else {
        term("Command '%s' not found.", input);
    }
}

module.exports = init;