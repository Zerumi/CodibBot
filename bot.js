const Discord = require('discord.js');
const Client = new Discord.Client();
const commands = new Discord.Collection();
const axios = require('axios');
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
  var userRole = [];
  var user = [];
  var stream;
stream = fs.createReadStream("./users.txt");
var users;
stream.on("data", function(data) {
    var chunk = data.toString();
    users = chunk;
});
  JSON.parse(users);
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
if (!(message.content.startsWith("!"))) {
  return;
}

const command = message.content.substr("!".length).split(' ')[0];
const args = message.content.substr(("!" + command + " ").length).split(' | ');

try {
	commands.get(command).execute(message, args);
  message.delete();
} catch (error) {

}
});