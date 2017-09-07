const Nitro = require("../../../Nitro.js")
let modules = Nitro.config.HELP;

module.exports = new Nitro.Command({
    help: "A list of commands.",
    example: "${p}help",
    argExample: "",
    dm: true,
    coolDown: 1,
    userPerms: 0,
    botPerms: [],

    args: [],

    run: async(message, bot, send) => {
        let commands = bot.allCommands;
        if (!message.checkSuffix) {
            let fields = [];
            for (let [key, val] of Object.entries(modules)) {
                let value = Object.entries(commands[key]).map(([k, c]) => `• ${k} - ${c.help}`).join("\n");
                fields.push({
                    name: `${val[0]} - ${val[1]}`,
                    value
                })
            }
            let embed = new bot.Embed();
            embed.fields = fields;
            embed.setColor(embed.randomColor);
            return send("", {
                embed
            })
        }

        let cmd = message.args[0];
        let cmds = {};

        for (let all of Object.keys(commands)) {
            for (let c of Object.keys(commands[all])) {
                cmds[c] = commands[all][c]
            }
        }

        if (!cmds[cmd]) return message.fail("Command not found:", cmd);
        let perms = [
            "User",
            "Moderator",
            "Admin",
            "Nitro Commander",
            "Dev"
        ];
        let c = cmds[cmd];
        let embed = new bot.Embed();
        embed.setTitle(`\`${cmd}\``)
            .addField("Help: ", c.help)
            .addField("Example: ", c.example.replace(/\$\{p\}/g, message.prefix))
            .addField("Arguments: ", c.argExample)
            .addField("Permission: ", perms[c.perm])
            .addField("Alias: ", c.alias.length > 0 ? c.alias.join() : "None")
            .setColor(embed.randomColor);
        return send("", { embed })
    }
})