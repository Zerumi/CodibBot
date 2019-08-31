const Discord = require('discord.js');
const Client = new Discord.Client();
const config = require('./config.json');
var users = require('./users.json');
var userRole = [];
var user = [];
Client.login(config.token);

Client.on("ready", async () => {
  console.log("CodibBot started...");
  Client.user.setStatus('online')
  Client.user.setPresence({
      game: {
          name: 'силу Genast Studio',
          type: 2
      }
  });
  updateServerList();
});
function updateServerList() {
  Client.guilds.get("603997328919101452").channels.get("616925716910702592").fetchMessage("617255059046268931").then(message => {
    message.edit({ embed: {
      title: "Список серверов, использующих CodibBot:",
      description: Client.guilds.array().map(g => g.name).toString(),
      timestamp: new Date(Date.now()),
      footer:
      {
        text: "Информация обновлена"
      }
    }})
  })
}
Client.on("guildDelete", async () => {
  updateServerList()
})
Client.on("guildCreate", async () => {
  updateServerList()
})
Client.on('guildMemberAdd', member => {
if (member.guild.name === "Genast Studio")
{
  for(var i in users)
    userRole.push(users[i]);

  for(var i in users)
    user.push(i);
  
  for (let index = 0; index < user.length; index++) {
    const element = user[index];
    if (element === member.id) {
      return member.addRole(member.guild.roles.find('name', userRole[index]),"Авторизован как " + element);
    }
  }
  const reason = "Не авторизован в базе";
  return member.kick(reason);
}
else
{
  return;
}
});
Client.on('message',(message)=> {
if (message.author.bot) {
  return;
}
if (message.content.startsWith("!help"))
{
  message.channel.send({ embed: {
    title: "Помощь по командам",
    description: "Абсолютно все команды доступны каждому участнику у кого есть право написать их в чат",
    fields: [
      {
        name: "!help",
        value: "То, что вы сейчас видите (помощь по командам)",
        inline: true
      },
      {
        name: "!vote (Тема для голосования)",
        value: "Открывает голосвание на ту или иную тему, а также ставит на это собственные отметки для оценивания",
        inline: true
      },
      {
        name: "!summaryvote (Имя | Возраст | Причина | Должность | Опыт | Номер аккаунта Discord)",
        value: "Открывает голосование на принятие человека на сервер (в противном случае, если включена фильтрация, человека кикнет)",
        inline: true
      },
      {
        name: "!ban (ID/Упоминание | Причина)",
        value: "Открывает голосование на блокировку участника на сервере",
        inline: true
      },
      {
        name: "!kick (ID/Упоминание | Причина)",
        value: "Открывает голосование на исключение участника из сервера",
        inline: true
      },
      {
        name: "!end vote (ID сообщения с голосванием)",
        value: "Завершает выбранное голосование с подсчетом итогов и дальнейшими дествиями если голосование имеет дополнительный параметр (например блокировка)",
        inline: true
      },
      {
        name: "!say (текст)",
        value: "Позволяет что-то написать от лица бота",
        inline: true
      },
      {
        name: "!uinfo (ID/Упоминание пользователя)",
        value: "Предоставляет информацию о пользователе/участнике сервера Discord",
        inline: true
      },
    ]
  }})
}
else if (message.content.startsWith("!kick")) {
  const args = message.content.slice("!kick ".length).split(" | ");
  if (args.length != 2)
  {
    message.delete();
    return message.channel.send("Использование: !kick id пользователя | Причина");
  }
  message.channel.send("@everyone");
  args[0] = args[0].replace('<','');
  args[0] = args[0].replace('>','');
  args[0] = args[0].replace('@','');
  Client.fetchUser(args[0]).then(user =>{
    message.channel.send({embed: {
      title: 'Голосование: Выгнать участника ' + user.tag + ' из сервера ' + message.guild.name,
      color: 3447003,
      description: 'Голосование открыл ' + message.author + ' по причине: ' + args[1] + '. Чтобы проголосовать, нажмите на кнопку внизу',
      timestamp: new Date(Date.now()),
      footer:
      {
        text: args[0] + ' | ' + args[1] + ' | Голосование началось'
      }
    }}).then(votemes => {
      votemes.react(Client.emojis.find(emoji => emoji.name === "4959_ThumbsUP"));
      votemes.react(Client.emojis.find(emoji => emoji.name === "2639_ThumbsDOWN"));
  })
  })
    return message.delete();
}
else if (message.content === "ping") {
  message.channel.send({ embed : {
    title: "PONG!",
    description: "Uptime: " + message.client.uptime + "ms\nPing: " + message.client.ping + "ms\nServer Count: " + Client.guilds.array().length,
    color: 3066993,
    timestamp: message.client.readyTimestamp,
    footer:
    {
      text: "Бот работает с"
    }
  }})
}
else if(message.content.startsWith("!say")){
  const arg = message.content.substr("!say ".length);
  if (!arg){
    message.delete();
    return message.channel.send("Использование: !say текст");
  }
  message.channel.send(arg);
  return message.delete();
}
else if(message.content.startsWith("!ban")){
  const args = message.content.slice("!ban ".length).split(" | ");
  if (args.length != 2)
  {
    message.delete();
    return message.channel.send("Использование: !ban id пользователя | Причина");
  }
  message.channel.send("@everyone");
  args[0] = args[0].replace('<','');
  args[0] = args[0].replace('>','');
  args[0] = args[0].replace('@','');
  Client.fetchUser(args[0]).then(user =>{
    message.channel.send({embed: {
      title: 'Голосование: Блокировка пользователя ' + user.tag + ' на сервере ' + message.guild.name,
      color: 3447003,
      description: 'Голосование открыл ' + message.author + ' по причине: ' + args[1] + '. Чтобы проголосовать, нажмите на кнопку внизу',
      timestamp: new Date(Date.now()),
      footer:
      {
        text: args[0] + ' | ' + args[1] + ' | Голосование началось'
      }
    }}).then(votemes => {
      votemes.react(Client.emojis.find(emoji => emoji.name === "4959_ThumbsUP"));
      votemes.react(Client.emojis.find(emoji => emoji.name === "2639_ThumbsDOWN"));
      message.channel.send("Для получения информации о пользователе, введите !uinfo " + user.id);
  })
  })
    return message.delete();
}
else if(message.content.startsWith("!uinfo")){
  var arg = message.content.substr("!uinfo ".length);
  if (!arg)
  {
    message.delete();
    return message.channel.send("Использование: !uinfo ID/Упоминание пользователя");
  }
  arg = arg.replace('<','');
  arg = arg.replace('>','');
  arg = arg.replace('@','');
  let guild = Client.guilds.get(message.guild.id);
  Client.fetchUser(arg).then(user =>{
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
  return message.delete();
}
else if(message.content.startsWith("!vote")){
  if(!message.content.substr("!vote ".length))
  {
    message.delete();
    return message.channel.send("Использование: !vote Тема для голосования");
  }
  if(message.content.substr("!vote ".length).includes("бан"))
  {
    message.delete();
    return message.channel.send("Использование !ban id пользователя/упоминание | Причина");
  }
  if(message.content.substr("!vote ".length).includes("кик"))
  {
    message.delete();
    return message.channel.send("Использование !kick id пользователя/упоминание | Причина")
  }
    message.channel.send("@everyone");
    message.channel.send({embed: {
        title: 'Голосование: ' + message.content.substr("!vote ".length),
        description: 'Голосование открыл ' + message.author + '. Чтобы проголосовать, нажмите на кнопку внизу',
        timestamp: new Date(Date.now()),
        footer:
        {
          text: 'Голосование началось'
        }
      }}).then(votemes => {
        votemes.react(Client.emojis.find(emoji => emoji.name === "4959_ThumbsUP"));
        votemes.react(Client.emojis.find(emoji => emoji.name === "2639_ThumbsDOWN"));
    })
    message.delete();
}
else if(message.content.startsWith("!summaryvote"))
{
  const args = message.content.slice("!summaryvote ".length).split(' | ');
  if (args.length != 6)
  {
    message.delete();
    return message.channel.send("Использование: !summaryvote Имя | Возраст | Причина | Должность | Опыт | Номер аккаунта Discord");
  }
  message.channel.send("@everyone");
    message.channel.send({embed: {
        title: 'Новая заявка в ' + message.guild.name + ': ' + args[0],
        color: 3447003,
        description: 'Голосование открыл ' + message.author + '.\nЗаявку отправил: <@' + args[5] + '> \nВозраст: ' + args[1] + '\nПричина: ' + args[2] + '\nЗаявка на должность: ' + args[3] + '\nОпыт: ' + args[4] + '\nЧтобы проголосовать, нажмите на кнопку внизу',
        timestamp: new Date(Date.now()),
        footer:
        {
          text: args[5] + " | " + args[3] + ' | Голосование началось'
        }
      }}).then(votemes => {
        votemes.react(Client.emojis.find(emoji => emoji.name === "4959_ThumbsUP"));
        votemes.react(Client.emojis.find(emoji => emoji.name === "2639_ThumbsDOWN"));
    })
    message.delete();
  }
else if (message.content.startsWith("!end vote"))
{
  const id = message.content.substr("!end vote ".length);
  if (!id) {
    return message.channel.send("Использование: !end vote id сообщения голосования");
  }
  message.channel.fetchMessage(id).then(r => {
    if (r.reactions.filter(a => a.emoji.name == Client.emojis.find(emoji => emoji.name === "4959_ThumbsUP").name).map(reaction => reaction.count)[0] + r.reactions.filter(a => a.emoji.name == Client.emojis.find(emoji => emoji.name === "2639_ThumbsDOWN").name).map(reaction => reaction.count)[0] < (r.guild.memberCount + 1) * 0.65){
      message.channel.send("В голосовании должно принять участие как минимум " + Math.ceil((r.guild.memberCount - 1) * 0.65) + " пользователя(-ей)");
      return message.delete();
    }
  var footext = r.embeds[0].footer.text;
  var title = r.embeds[0].title;
  var description = r.embeds[0].description.replace("Чтобы проголосовать, нажмите на кнопку внизу", "");
  if (footext.includes("Голосование завершилось: ")) {
    return message.channel.send("Голосование уже завершено");
  }
  if (title.includes("Блокировка пользователя"))
  {
    var banid = footext.split(" | ")[0];
    Client.fetchUser(banid).then(banuser => { 
      if (r.reactions.filter(a => a.emoji.name == Client.emojis.find(emoji => emoji.name === "4959_ThumbsUP").name).map(reaction => reaction.count)[0] <= r.reactions.filter(a => a.emoji.name == Client.emojis.find(emoji => emoji.name === "2639_ThumbsDOWN").name).map(reaction => reaction.count)[0]){
        return;
      }
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
      Client.fetchUser(kickid).then(kickuser => { 
        if (r.reactions.filter(a => a.emoji.name == Client.emojis.find(emoji => emoji.name === "4959_ThumbsUP").name).map(reaction => reaction.count)[0] <= r.reactions.filter(a => a.emoji.name == Client.emojis.find(emoji => emoji.name === "2639_ThumbsDOWN").name).map(reaction => reaction.count)[0]){
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
    if (r.reactions.filter(a => a.emoji.name == Client.emojis.find(emoji => emoji.name === "4959_ThumbsUP").name).map(reaction => reaction.count)[0] <= r.reactions.filter(a => a.emoji.name == Client.emojis.find(emoji => emoji.name === "2639_ThumbsDOWN").name).map(reaction => reaction.count)[0]){
      return;
    }
    user.push(footext.split(" | ")[0])
    userRole.push(footext.split(" | ")[1])
  }
  r.edit({ embed: {
      title: title,
      description: description,
      footer:
      {
        text: "Голосование завершилось: " + r.reactions.filter(a => a.emoji.name == Client.emojis.find(emoji => emoji.name === "4959_ThumbsUP").name).map(reaction => reaction.count)[0] + " за " + r.reactions.filter(a => a.emoji.name == Client.emojis.find(emoji => emoji.name === "2639_ThumbsDOWN").name).map(reaction => reaction.count)[0] + " против",
        icon_url: message.author.avatarURL
      }
  }})
  message.channel.send({ embed: {
    description: 'Голосование завершилось с итогами ' + r.reactions.filter(a => a.emoji.name == Client.emojis.find(emoji => emoji.name === "4959_ThumbsUP").name).map(reaction => reaction.count)[0] + ' за и ' + r.reactions.filter(a => a.emoji.name == Client.emojis.find(emoji => emoji.name === "2639_ThumbsDOWN").name).map(reaction => reaction.count)[0] + ' против',
    timestamp: new Date(Date.now()),
        footer:
        {
          text: title
        }
  }});
  message.delete();
  return r.clearReactions();
});
}
});