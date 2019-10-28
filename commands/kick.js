const Message = require('discord.js').Message;
const library = require('../library');
module.exports = {
    name: "kick",
    description: "Kick",
    /**
     * @param {Message} message 
     * @param {Array<string>} args 
     */
    execute(message,args){
            if (args.length != 2)
            {
              return message.channel.send("Использование: !kick id пользователя | Причина");
            }
            args[0] = library.slowflakehandle(args[0]);
            message.client.fetchUser(args[0]).then(user =>{
              if (!message.channel.permissionsFor(user).has("READ_MESSAGES")) {
                return message.channel.send("Создавать голосование на блокировку пользователя можно только в канале, в который у него есть доступ");
              }
              message.channel.send("@everyone", {embed: {
                title: 'Голосование: Выгнать участника ' + user.tag + ' из сервера ' + message.guild.name,
                color: 3447003,
                description: 'Голосование открыл ' + message.author + ' по причине: ' + args[1] + '. Чтобы проголосовать, нажмите на кнопку внизу',
                timestamp: new Date(Date.now()),
                footer:
                {
                  text: args[0] + ' | ' + args[1] + ' | Голосование началось'
                }
              }}).then(async(votemes) => {
                await votemes.react(votemes.client.emojis.find(emoji => emoji.name === "4959_ThumbsUP"));
                await setTimeout(() => {
                  votemes.react(votemes.client.emojis.find(emoji => emoji.name === "2639_ThumbsDOWN"));
                }, 100);
            })
            })
    }
}