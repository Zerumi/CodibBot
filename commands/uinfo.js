module.exports = {
    name: "uinfo",
    description: "Uinfo",
    execute(message, args){
        if (args[0] === "")
        {
          return message.channel.send("Использование: !uinfo ID/Упоминание пользователя");
        }
        args[0] = args[0].replace('<','');
        args[0] = args[0].replace('>','');
        args[0] = args[0].replace('@','');
        let guild = message.client.guilds.get(message.guild.id);
        message.client.fetchUser(args[0]).then(user =>{
        if (guild.member(user)) {
          message.guild.fetchMember(user).then(member =>{
            message.channel.send({ embed: {
              title: "**Информация об участнике**: " + user.tag,
              description: "**ID**: " + member.user.id + "\n**Статус**: " + member.user.presence.status + "\n**Аккаунт создан**: " + member.user.createdAt + "\n**Роли[" + (member.roles.array().length - 1) + "]**:\n" + member.roles.array().slice(1,member.roles.array().length) + "\n**Возможности[" + member.permissions.valueOf() + "][" + member.permissions.toArray().length + "]**:\n" + member.permissions.toArray() + "\n**Пользователь зашел на сервер**: " + member.joinedAt,
              timestamp: new Date(Date.now()),
              footer:
              {
                text: "Информацию запросил " + message.author.tag,
                icon_url: message.author.avatarURL
              },
              thumbnail:
              {
                url: user.avatarURL
              }
            }})
          })
        } else {
          message.channel.send({ embed: {
            title: "**Информация о пользователе**: " + user.tag,
            description: "**ID**: " + user.id + "\n**Статус**: Нет на сервере" + "\n**Аккаунт создан**: " + user.createdAt + "\n**Примечание**: Пользователя нет на сервере и некоторая информация недоступна",
            timestamp: new Date(Date.now()),
            thumbnail:
            {
              url: user.avatarURL
            },
            footer:
            {
              text: "Информацию запросил " + message.author.tag,
              icon_url: message.author.avatarURL
            }
          }})
        }
        })      
    }
}