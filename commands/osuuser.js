var axios = require('axios');
module.exports = {
    name: "osuuser",
    description: "Osu user",
    execute(message,args){
        if (args[0] === "") {
          return message.channel.send("Использование: !osuuser Имя пользователя osu!");
        }
        const url = 'https://osu.ppy.sh/api/get_user?u=' + args[0] + '&k=' + require("../config.json").osu + '&type=string';
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
}