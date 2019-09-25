module.exports = {
    name: "kick",
    description: "Kick",
    execute(message,args){
            if (args.length != 2)
            {
              return message.channel.send("Использование: !kick id пользователя | Причина");
            }
            message.channel.send("@everyone");
            args[0] = args[0].replace('<','');
            args[0] = args[0].replace('>','');
            args[0] = args[0].replace('@','');
            message.client.fetchUser(args[0]).then(user =>{
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
                await votemes.react(votemes.client.emojis.find(emoji => emoji.name === "4959_ThumbsUP"));
                await setTimeout(() => {
                  votemes.react(votemes.client.emojis.find(emoji => emoji.name === "2639_ThumbsDOWN"));
                }, 100);
            })
            })
    }
}