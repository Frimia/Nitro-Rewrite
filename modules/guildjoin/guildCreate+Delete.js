const snekfetch = require("snekfetch");
const Long = require("long");
const bot = require("./bot.js");
const { botsDiscordPw, discordListsOrg, carbonitexNet, novoArchboxPro } = bot.config.auth.LISTS;

const embed = new bot.Embed();
embed.setTitle("So, you invited Nitro...")
    .setDescription("")
    .addField("Getting Started", "Get the commands with `n!help`")
    .addField("Support Server", "https://discord.gg/aZ2PYhn")
    .setFooter("Hello")
    .setTimestamp(new Date())
    .nitroColor();


bot.on("guildCreate", guild => {
    if (guild.members.filter(m => m.user.bot).size > 30)
        return guild.leave().catch(console.error);

    const defchannel = defaultChannel(guild) || guild.owner;
    defchannel.send({embed}).catch(console.error);

    postStats();
});

bot.on("guildDelete", guild => postStats());

const postStats = async() => {
    if (bot.isBeta) return;
    let guildcount = await bot.shard.clientValuesReduced("guilds.size");

    makeRequest("https://bots.discord.pw/api/bots/264087705124601856/stats", {
        shard_id: bot.shard.id,
        shard_count: bot.shard.count,
        server_count: bot.guilds.size
    }, botsDiscordPw);

    makeRequest("https://discordbots.org/api/bots/264087705124601856/stats", {
        shard_id: bot.shard.id,
        shard_count: bot.shard.count,
        server_count: bot.guilds.size
    }, discordListsOrg);

    makeRequest("https://www.carbonitex.net/discord/data/botdata.php", {
        key: carbonitexNet,
        servercount: guildcount || 0,
        shardcount: bot.shard.count
    })

    makeRequest("https://novo.archbox.pro/api/bots/264087705124601856", {
        server_count: guildcount || 0
    }, novoArchboxPro)
}

const makeRequest = (url, body, auth) => {
    const req = snekfetch.post(url);
    auth && req.set("Authorization", auth);
    req.set("Content-Type", "application/json")
        .send(body)
        .then().catch(e => console.log(e));
}

const defaultChannel = guild => guild.channels
    .filter(c => c.type === "text" &&
        c.permissionsFor(bot.user).has("SEND_MESSAGES"))
    .sort((a, b) => a.position - b.position ||
        Long.fromString(a.id).sub(Long.fromString(b.id)).toNumber())
    .first();

