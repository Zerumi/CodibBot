module.exports = {
    name: "summaryvote",
    description: "Summaryvote",
    execute(message,args){
        if (args.length != 6)
        {
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
              await votemes.react(votemes.client.emojis.find(emoji => emoji.name === "4959_ThumbsUP"));
              await setTimeout(() => {
                votemes.react(votemes.client.emojis.find(emoji => emoji.name === "2639_ThumbsDOWN"));
              }, 100);
          })      
    }
}