module.exports = new Nitro.Command({
  help: "",
  example: "",
  argExample: "",
  dm: false,
  coolDown: 1,
  userPerms: [],
  botPerms: [],

  args: [],
  alias: ["modh"],

  run: async (message, bot, send) => {
    let caseman = message.guild.check("caseman")
    if (!caseman) throw new Error("CaseManager Not Initialized")
    let cases = caseman.cases
    let user
    if (!message.checkSuffix) user = message.member
    else user = await message.parseUser(message.args[0])
    if (!user) return send("**Invalid User:** " + message.args[0])
    user = user.user

    let a = {}
    cases = cases.filter(c => c.moderator.id === user.id)
    for (let c of cases) {
      if (!a[c.action]) a[c.action] = 1
      else a[c.action]++
    }
    let embed = new bot.embed()
    embed.setAuthor(user.tag, user.avatarURL())
      .setTitle("Moderator History")
      .setDescription(`**Banned:** ${a.ban || 0}, **Tempbanned:** ${a.tempban || 0}, **Softbanned:** ${a.softban || 0}, **Kicked:** ${a.kick || 0}, **Muted:** ${a.mute || 0}, **Warned:** ${a.warn || 0}`)
      .setColor(embed.randomColor)
    send("", {embed})
  }
})
