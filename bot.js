const Discord = require('discord.js');
const Client = new Discord.Client();
const axios = require('axios');
const config = require('./config.json');
var users = require('./users.json');
var fs = require('fs');
var userRole = [];
var user = [];
var osuuser = "";
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
      title: "Список серверов, использующих CodibBot(" + Client.guilds.array().length + "):",
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
      {
        name: "!osu user (Имя пользователя)",
        value: "Предоставляет информацию о пользователе https://osu.ppy.sh/",
        inline: true
      },
      {
        name: "!weather (Город)",
        value: "Предоставляет информацию о погоде в указанном городе.\n**ВАЖНО!** Город указывать на английском, список городов находится тут: https://docks-codibbot.glitch.me/city-list.html",
        inline: true
      }
    ],
    footer:
    {
      text: require('./package.json').name + " " + require('./package.json').version + " by " + require("./package.json").author
    } // + Build date
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
    }}).then(async(votemes) => {
      await votemes.react(Client.emojis.find(emoji => emoji.name === "4959_ThumbsUP"));
      setTimeout(() => {
        votemes.react(Client.emojis.find(emoji => emoji.name === "2639_ThumbsDOWN"));
      }, 100);
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
else if (message.content.startsWith("!purge")) {
  message.guild.fetchMember(message.author).then(async(member) =>{
    if (member.permissions.has("ADMINISTRATOR")) {
      let fetched;
      fetched = await message.channel.fetchMessages({limit: parseInt(message.content.substr("!purge ".length)) + 1});
      message.channel.bulkDelete(fetched);
    }
    else
    {
      message.channel.send("Служба контроля за погромом сервера запретила массовые удаления сообщений участникам без прав администратора.").then(mes =>{
        setTimeout(() => {
          mes.delete()
        }, 5000);
      })
    }
  })
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
    }}).then(async(votemes) => {
      await votemes.react(Client.emojis.find(emoji => emoji.name === "4959_ThumbsUP"));
      setTimeout(() => {
        votemes.react(Client.emojis.find(emoji => emoji.name === "2639_ThumbsDOWN"));
      }, 100);
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
      }}).then(async(votemes) => {
        await votemes.react(Client.emojis.find(emoji => emoji.name === "4959_ThumbsUP"));
        setTimeout(() => {
          votemes.react(Client.emojis.find(emoji => emoji.name === "2639_ThumbsDOWN"));
        }, 100);
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
      }}).then(async(votemes) => {
        await votemes.react(Client.emojis.find(emoji => emoji.name === "4959_ThumbsUP"));
        setTimeout(() => {
          votemes.react(Client.emojis.find(emoji => emoji.name === "2639_ThumbsDOWN"));
        }, 100);
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
    var users = 0;
    const reactUP = (r.reactions.filter(a => a.emoji.name == Client.emojis.find(emoji => emoji.name === "4959_ThumbsUP").name).map(reaction => reaction.count)[0] - 1);
    const reactDOWN = (r.reactions.filter(a => a.emoji.name == Client.emojis.find(emoji => emoji.name === "2639_ThumbsDOWN").name).map(reaction => reaction.count)[0] - 1);
    const usersUP = r.reactions.filter(a => a.emoji.name == Client.emojis.find(emoji => emoji.name === "4959_ThumbsUP").name).map(reaction => reaction.users)[0];
    const usersDOWN = r.reactions.filter(a => a.emoji.name == Client.emojis.find(emoji => emoji.name === "2639_ThumbsDOWN").name).map(reactions => reactions.users)[0];
    for (var i in usersUP)
    {
      for (var j in usersDOWN)
      {
        if (i === j) {
          continue;
        }
        users = users + 1;
      }
    }
    if (users < Math.ceil((r.guild.memberCount - 1) * 0.65)){
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
        if (reactUP <= reactDOWN){
         return;
       }
       let voteusers = JSON.stringify(usersUP.map(us => us.tag));
       voteusers = voteusers.replace("[", "");
       voteusers = voteusers.replace("]", "");
       voteusers = voteusers.replace("\"CodibBot#9530\",", "");
       banuser.sendMessage("По итогам голосования №" + r.id + " вы были заблокированы на сервере " + r.guild.name + " по причине " + footext.split(" | ")[1] + ". Если вы хотите обжаловать решение, свяжитесь с любым из участников данного сервера. За вашу блокировку проголосовали: " + voteusers)
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
    user.push(footext.split(" | ")[0])
    userRole.push(footext.split(" | ")[1])
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
  message.delete();
  return r.clearReactions();
})
}
else if (message.content.startsWith("!osu user")) {
  osuuser = message.content.substr("!osu user ".length);
  const url = 'https://osu.ppy.sh/api/get_user?u=' + osuuser + '&k=' + config.osu + '&type=string';
  axios.default.get(url)
  .then(response => {
    var value = []
    for (var i in response.data[0])
      value.push(response.data[0][i])
    message.channel.send({ embed: {
      title: "**Информация о пользователе osu!**: " + value[1],
      description: "**ID**: " + value[0] + "\n**Уровень**: " + value[10] + "\n**Пользователь зарегистрирован**: " + value[2] + "\n**Количество сыгранных игр\***: " + value[6] + "\n**Показатель производительности**: " + value[11] + "\n**Место в мире**: " + value[9] + " (в стране " + value[18] + ": " + value[20] + ")\n**SS**: " + value[13] + "\n**SS+**: " + value[14] + "\n**S**: " + value[15] + "\n**S**+: " + value[16] + "\n**A**: " + value[17] + "\n*Подсчет статистики об играх ведется исключительно на ранкнутых/принятых/избранных картах\nЕсли показатель производительности равен нулю, это означает что пользователь долгое время был неактивен",
      timestamp: new Date(Date.now()),
      footer:
      {
        text: "Информацию запросил: " + message.author.tag,
        icon_url: message.author.avatarURL
      },
      thumbnail:
      {
        url: 'https://a.ppy.sh/' + value[0] + '?1546500578.jpeg&quot'
      }
    }})
  })
  .catch(error => {
    console.log(error);
    message.channel.send("Использование: !osu user Имя аккаунта")
  });
}
else if (message.content.startsWith("!weather"))
{
  const arg = message.content.substr("!weather ".length);
  const url = "http://api.openweathermap.org/data/2.5/weather?q=" + arg + "&APPID=" + config.weather
  axios.default.get(url).then(response =>{
    var temp = Math.round(response.data.main.temp - 273.15);
    var pressure = Math.round(response.data.main.pressure / 1.333);
    var weather = response.data.weather[0].main;
    var humidity = response.data.main.humidity;
    var wspeed = response.data.wind.speed;
    var deg = response.data.wind.deg;
    var degnorm;
    if (deg >= 337.6 && deg <= 22.5) {
      degnorm = "северный";
    }
    else if (deg >= 22.6 && deg <= 67.5) {
      degnorm = "северо-восточный";
    }
    else if (deg >= 67.6 && deg <= 112.5) {
      degnorm = "восточный";
    }
    else if (deg >= 112.6 && deg <= 157.5) {
      degnorm = "юго-восточный";
    }
    else if (deg >= 157.6 && deg <= 202.5) {
      degnorm = "южный";
    }
    else if (deg >= 202.6 && deg <= 247.5) {
      degnorm = "юго-западный";
    }
    else if (deg >= 247.6 && deg <= 292.5) {
      degnorm = "западный";
    }
    else if (deg >= 292.6 && deg <= 337.5) {
      degnorm = "северо-западный";
    }
    var country = response.data.sys.country;
    var visibility = response.data.visibility;
    message.channel.send({embed : {
      title: "**Информация о погоде в городе**: " + arg + "(" + country + ")",
      description: "**Общее состояние**: " + weather + "\n**Температура**: " + temp + "°C\n**Давление**: " + pressure + "мм.рт.с\n**Влажность**: " + humidity + "%\n**Ветер " + degnorm + "**: " + wspeed + "м/с\n**Видимость**: " + visibility + "м",
      thumbnail:
      {
        url: "http://openweathermap.org/img/w/" + response.data.weather[0].icon + ".png"
      },
      timestamp: new Date(Date.now()),
      footer:
      {
        text: "Информацию запросил " + message.author.tag,
        icon_url: message.author.avatarURL
      }
    }});
  }).catch(error =>{
    message.channel.send("Что-то пошло не так... Прикрепляю ответ API: " + error.response.status + " - " + error.response.statusText);
  })
}
});