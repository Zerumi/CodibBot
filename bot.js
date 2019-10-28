const Discord = require('discord.js');
const Client = new Discord.Client();
const commands = new Discord.Collection();
const config = require('./config.json');
const fs = require('fs');
Client.login(config.token);

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  commands.set(command.name, command);
}

Client.on("ready", async () => {
  console.log("CodibBot started...");
  Client.user.setStatus('online');
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

Client.on("guildCreate", async (guild) => {
  guild.owner.send({
    embed: {
      title: "Спасибо за добавление нашего бота на сервер " + guild.name + "!",
      description: "Для получения информации, введите !help"
    }
  })
  updateServerList()
})

Client.on('message',(message)=> {
if (message.author.bot) {
  return;
}
if (!(message.content.startsWith("!"))) {
  return;
}
if (!message.guild) {
  return message.channel.send("Это действие можно сделать только на сервере. Добавьте меня к вам на сервер, перейдя по ссылке: https://discordapp.com/oauth2/authorize?client_id=603999060726120448&scope=bot&permissions=268958790");
}

const command = message.content.substr("!".length).split(' ')[0];
const args = message.content.substr(("!" + command + " ").length).split(' | ');

try {
	commands.get(command).execute(message, args);
  message.delete();
} catch (error) {
  // console.error(error);
}
});