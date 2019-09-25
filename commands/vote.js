module.exports = {
    name: "vote",
    description: "Vote",
    execute(message,args){
        if(args[0] === "")
        {
          return message.channel.send("Использование: !vote Тема для голосования");
        }
          message.channel.send("@everyone");
          message.channel.send({ embed: {
              title: 'Голосование: ' + args[0],
              description: 'Голосование открыл ' + message.author + '. Чтобы проголосовать, нажмите на кнопку внизу',
              timestamp: new Date(Date.now()),
              footer:
              {
                text: 'Голосование началось'
              }
            }}).then(async(votemes) => {
              await votemes.react(votemes.client.emojis.find(emoji => emoji.name === "4959_ThumbsUP"));
              await setTimeout(() => {
                votemes.react(votemes.client.emojis.find(emoji => emoji.name === "2639_ThumbsDOWN"));
              }, 100);
          })      
    }
}