const fs = require('fs');
module.exports = {
    name: "vend",
    description: "End",
    execute(message, args){
        if (args[0] === "") {
            return message.channel.send("Использование: !vend id сообщения голосования");
          }
          message.channel.fetchMessage(args[0]).then(r => {
            if (r.author.id !== "603999060726120448") {
              return message.channel.send("Использование: !vend id сообщения голосования")
            }
            const reactUP = (r.reactions.filter(a => a.emoji.name == r.client.emojis.find(emoji => emoji.name === "4959_ThumbsUP").name).map(reaction => reaction.count)[0] - 1);
            const reactDOWN = (r.reactions.filter(a => a.emoji.name == r.client.emojis.find(emoji => emoji.name === "2639_ThumbsDOWN").name).map(reaction => reaction.count)[0] - 1);
            if (reactUP + reactDOWN < Math.ceil((r.guild.memberCount - 1) * 0.65)){
              return message.channel.send("В голосовании должно принять участие как минимум " + Math.ceil((r.guild.memberCount - 1) * 0.65) + " пользователя(-ей)");
            }
            var footext = r.embeds[0].footer.text;
            if (footext.includes("Голосование изменено")) {
              var timestamp = r.embeds[0].timestamp;
              if ((Date.parse(timestamp) + 300000) > Date.now()) {
                return message.channel.send("Изменённое голосование нельзя закончить раньше чем через 5 минут после его изменения");
              }
            }
            var title = r.embeds[0].title;
            var description = r.embeds[0].description.replace("Чтобы проголосовать, нажмите на кнопку внизу", "");
            if (footext.includes("Голосование завершилось")) {
              return message.channel.send("Голосование уже завершено");
            }
            if (title.includes("Блокировка пользователя"))
            {
              var banid = footext.split(" | ")[0];
              r.client.fetchUser(banid).then(banuser => { 
                if (reactUP <= reactDOWN){
                 return;
               }
               banuser.sendMessage("По итогам голосования №" + r.id + " вы были заблокированы на сервере " + r.guild.name + " по причине " + footext.split(" | ")[1] + ". Если вы хотите обжаловать решение, свяжитесь с любым из участников данного сервера.")
                r.guild.ban(banuser, footext.split(" | ")[1]);
                message.channel.send({ embed: {
                 title: "Пользователь " + banuser.tag + " был заблокирован голосованием",
                  description: "Причина: " + footext.split(" | ")[1],
                 timestamp: new Date(Date.now()),
                 footer:
                  {
                    text: "Пользователь заблокирован",
                    icon_url: message.author.avatarURL
                  }
                }})
              });
            }
            if (title.includes("Выгнать участника"))
            {
              var kickid = footext.split(" | ")[0];
              r.client.fetchUser(kickid).then(kickuser => { 
                if (reactUP <= reactDOWN){
                  return;
                }
                r.guild.member(kickuser).kick(footext.split(" | ")[1]);
                message.channel.send({ embed: {
                  title: "Пользователь " + kickuser.tag + " был исключен голосованием",
                  description: "Причина: " + footext.split(" | ")[1],
                  timestamp: new Date(Date.now()),
                  footer:
                  {
                    text: "Пользователь исключен",
                    icon_url: message.author.avatarURL
                  }
                }})
              });
            }
          if (title.includes("Новая заявка в")) {
            if (reactUP <= reactDOWN){
              return;
            }
            var stream = fs.createWriteStream("../users.txt");
            stream.write("\n" + footext.split(" | ")[0] + " : " + footext.split(" | ")[1]);
          }
          r.edit({ embed: {
              title: title,
              description: description,
              footer:
              {
                text: "Голосование завершилось: " + reactUP + " за " + reactDOWN + " против",
                icon_url: message.author.avatarURL
              }
          }})
          message.channel.send({ embed: {
            description: 'Голосование завершилось с итогами ' + reactUP + ' за и ' + reactDOWN + ' против',
            timestamp: new Date(Date.now()),
                footer:
                {
                  text: title
                }
          }});
          r.clearReactions();
        })        
    }
}