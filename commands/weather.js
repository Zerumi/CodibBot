var axios = require('axios');
module.exports = {
    name: "weather",
    description: "Weather",
    execute(message, args){
        const url = "http://api.openweathermap.org/data/2.5/weather?q=" + args[0] + "&APPID=" + require("../config.json").weather
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
          message.channel.send({embed : {
            title: "**Информация о погоде в городе**: " + args[0] + "(" + country + ")",
            description: "**Общее состояние**: " + weather + "\n**Температура**: " + temp + "°C\n**Давление**: " + pressure + "мм.рт.с\n**Влажность**: " + humidity + "%\n**Ветер " + degnorm + "**: " + wspeed + "м/с",
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
}