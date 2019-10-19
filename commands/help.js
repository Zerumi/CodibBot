const Message = require('discord.js').Message;
module.exports = {
    name: "help",
    description: "Help",
    /**
     * @param {Message} message 
     * @param {Array<string>} args 
     */
    execute(message, args) {
        message.channel.send({ embed: {
            title: "Помощь по командам",
            description: "Абсолютно все команды доступны каждому участнику у кого есть право написать их в чат",
            fields: [
              {
                name: "**!help**",
                value: "То, что вы сейчас видите (помощь по командам)",
                inline: true
              },
              {
                name: "**!say (текст)** или **!say Первая строка | Вторая строка**",
                value: "Позволяет что-то написать от лица бота",
                inline: true
              },
              {
                name: "**!vote (Тема для голосования)**",
                value: "Открывает голосвание на ту или иную тему, а также ставит на это собственные отметки для оценивания",
                inline: true
              },
              {
                name: "**!ban (ID/Упоминание | Причина)**",
                value: "Открывает голосование на блокировку участника на сервере",
                inline: true
              },
              {
                name: "**!kick (ID/Упоминание | Причина)**",
                value: "Открывает голосование на исключение участника из сервера",
                inline: true
              },
              {
                name: "**!vedit**",
                value: "Редактирует тему голосования (доступно только создателю этого голосования)",
                inline: true
              },
              {
                name: "**!vend**",
                value: "Завершает выбранное голосование с подсчетом итогов и дальнейшими дествиями если голосование имеет дополнительный параметр (например блокировка)",
                inline: true
              },
              {
                name: "**!uinfo (ID/Упоминание пользователя)**",
                value: "Предоставляет информацию о пользователе/участнике сервера Discord",
                inline: true
              },
              {
                name: "**!osuuser (Имя пользователя)**",
                value: "Предоставляет информацию о пользователе https://osu.ppy.sh/",
                inline: true
              },
              {
                name: "**!weather (Город)**",
                value: "Предоставляет информацию о погоде в указанном городе.\n**ВАЖНО!** Город указывать на английском, список городов находится тут: https://docks-codibbot.glitch.me/city-list.html",
                inline: true
              },
              {
                name: "**!wforecast (Город)**",
                value: "Предоставляет информацию о погоде в указанном городе на 4 дня вперёд.\n**ВАЖНО!** Город указывать на английском, список городов находится тут: https://docks-codibbot.glitch.me/city-list.html",
                inline: true
              }
            ],
            footer:
            {
              text: require('../package.json').name + " " + require('../package.json').version + " by " + require("../package.json").author
            }
        }})        
    }
}