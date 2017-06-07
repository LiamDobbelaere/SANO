function init() {
    const Discord = require('discord.js');
    const client = new Discord.Client();

    client.on('ready', () => {

    });

    client.on('message', message => {

    });

    client.login(process.env.SANO_DISCORD_TOKEN);

    console.log("sano-discord ok");

    function notifyNewRequest(id) {
        client.channels.find("name", "responders").send("New request! Answer at https://www.digaly.net/respond/" + id);
    }

    return {
        notifyNewRequest: notifyNewRequest
    }
}

module.exports = init;