const bot = require("./bot.js")
const { CHANNELS } = require("../../config.js")
const fs = require("fs")

async function loop() {
    let channel = bot.channels.get("356281236387266561");
    if (!channel) return;
    let message;
    let stats = {};
    try {
        message = await channel.messages.fetch(CHANNELS.STATUS);
        stats.guilds = await bot.shard.clientValuesReduced("guilds.size");
        stats.channels = await bot.shard.clientValuesReduced("channels.size");
        stats.users = await bot.shard.clientValuesReduced("users.size");
    } catch (err) {
        return console.log(err);
    }
    fs.readdir("./modules", (err, modules) => {
        if (err) return console.log("Failed to read modules");
        stats.modules = modules.length;
        let embed = new bot.Embed();
        embed.setTitle("`[ Live Statistics ]`")
            .addField("`Guilds`", stats.guilds, true)
            .addField("`Channels`", stats.channels, true)
            .addField("`Users`", stats.users, true)
            .addField("`Shards`", bot.shard.count, true)
            .addField("`Modules`", stats.modules, true)
            .setColor(embed.randomColor)
            .setTimestamp(new Date());
        message.edit("", { embed });
        setTimeout(() => loop(), 300000);
    });
};

loop();