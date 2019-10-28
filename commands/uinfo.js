const discord = require('discord.js');
const Message = require('discord.js').Message;
const library = require('../library');
module.exports = {
    name: "uinfo",
    description: "Uinfo",
    /**
     * @param {Message} message 
     * @param {Array<string>} args 
     */
    execute(message, args){
      if (!message.guild) {
        return message.channel.send("Это действие можно сделать только на сервере. Добавьте меня к вам на сервер, введя !invite");
      }
        if (args[0] === "")
        {
          return message.channel.send("Использование: !uinfo ID/Упоминание пользователя");
        }
        args[0] = library.slowflakehandle(args[0]);
        let guild = message.client.guilds.get(message.guild.id);
        message.client.fetchUser(args[0]).then(user =>{
        let avatarURL = library.checkAvatar(user);
        let authorAvatarURL = library.checkAvatar(message.author)
        let debuginfo = "";
        if (user.bot) {
          debuginfo += " (является ботом)";
        }
        var embed = new discord.RichEmbed();
        embed.setThumbnail(avatarURL)
        embed.setTimestamp(new Date(Date.now()))
        embed.setFooter("Информацию запросил " + message.author.tag,authorAvatarURL)
        embed.addField("**ID**",user.id,true)
        embed.addField("**Статус**",user.presence.status,true)
        embed.addField("**Аккаунт создан**:",user.createdAt.toUTCString(),true)
        if (user.presence.game === null) {}
        else if (user.presence.game.name === "Custom Status") {
          embed.addField("**Пользовательский статус**:",user.presence.game.state,true);
        }
        else if (user.presence.game.state !== null) {
          embed.addField("**Играет в игру**: " + user.presence.game.name, user.presence.game.details + "\n" + user.presence.game.state + "\n",true);
        }
        else {
          embed.addField("**Играет в игру**: ", user.presence.game.name,true)
        }
        if (guild.member(user)) {
          message.guild.fetchMember(user).then(member =>{
            if (member.nickname !== null) {
              debuginfo = "(" + member.nickname + ") " + debuginfo;
            }
            embed.setTitle("**Информация об участнике**: " + user.tag + debuginfo)
            if (member.roles.array().slice(1,member.roles.array().length).length !== 0) {
              embed.addField("**Роли[" + (member.roles.array().length - 1) + "]**:",member.roles.array().slice(1,member.roles.array().length).toString(),true);
            }
            embed.addField("**Возможности[" + member.permissions.valueOf() + "][" + member.permissions.toArray().length + "]**:",member.permissions.toArray().toString(),true)
            embed.addField("**Пользователь зашел на сервер**:",member.joinedAt.toUTCString(),true);
            return message.channel.send(embed)
          })
        } else {
          embed.setTitle("**Информация об участнике**: " + user.tag + debuginfo)
          message.channel.send("**Примечание**: Некоторая информация недоступна так как участника нет на сервере",embed);
        }
      })
    }
}