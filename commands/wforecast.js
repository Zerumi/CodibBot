const axios = require('axios');
module.exports = {
    name: "wforecast",
    description: "Weather forecast",
    execute(message, args){
const url = "http://api.openweathermap.org/data/2.5/forecast?q=" + args[0] + "&appid=" + require("../config.json").weather;
axios.default.get(url).then(resp =>{
  for (let j = 0; j < 40; j++) {
    if (resp.data.list[j].dt_txt.includes("00:00:00")) {
      ind = j;
      break;
    }
  }
  for (let e = 0; e < 4; e++) {
    var temp = [];
    var pressure = [];
    var weather = [];
    var humidity = [];
    var wspeed = [];
    var deg;
    var degnorm = [];
    var country = resp.data.city.country;
    var dt_txt = [];
    var icon;
    var ind;
    for (let j = ind; j < ind + 8; j++) {
      if (resp.data.list[j].dt_txt.includes("03:00:00") || resp.data.list[j].dt_txt.includes("09:00:00") || resp.data.list[j].dt_txt.includes("15:00:00") || resp.data.list[j].dt_txt.includes("21:00:00"))
      {
        continue;
      }
      if (resp.data.list[j].dt_txt.includes("12:00:00")) {
        icon = resp.data.list[j].weather[0].icon;
      }
      temp.push(Math.round(resp.data.list[j].main.temp - 273.15));
      pressure.push(Math.round(resp.data.list[j].main.pressure / 1.333))
      weather.push(resp.data.list[j].weather[0].main);
      humidity.push(resp.data.list[j].main.humidity);
      wspeed.push(resp.data.list[j].wind.speed);
      deg = resp.data.list[j].wind.deg;
      if (deg >= 337.6 && deg <= 22.5) {
        degnorm.push("северный");
      }
      else if (deg >= 22.6 && deg <= 67.5) {
        degnorm.push("северо-восточный");
      }
      else if (deg >= 67.6 && deg <= 112.5) {
        degnorm.push("восточный");
      }
      else if (deg >= 112.6 && deg <= 157.5) {
        degnorm.push("юго-восточный");
      }
      else if (deg >= 157.6 && deg <= 202.5) {
        degnorm.push("южный");
      }
      else if (deg >= 202.6 && deg <= 247.5) {
        degnorm.push("юго-западный");
      }
      else if (deg >= 247.6 && deg <= 292.5) {
        degnorm.push("западный");
      }
      else if (deg >= 292.6 && deg <= 337.5) {
        degnorm.push("северо-западный");
      }
      dt_txt.push(resp.data.list[j].dt_txt);  
    }
    ind = ind + 8;
    message.channel.send({embed : {
      title: "**Информация о погоде в городе**: " + args[0] + "(" + country + ")",
      footer:
      {
        text: "Информация от OpenWeatherMapAPI",
        icon_url: "http://openweathermap.org/img/w/" + icon + ".png"
      },
      fields: [
        {
          name: "Информация на " + dt_txt[0],
          value: "**Общее состояние**: " + weather[0] + "\n**Температура**: " + temp[0] + "°C\n**Давление**: " + pressure[0] + "мм.рт.с\n**Влажность**: " + humidity[0] + "%\n**Ветер " + degnorm[0] + "**: " + wspeed[0] + "м/с",
          inline: true
        },
        {
          name: "Информация на " + dt_txt[1],
          value: "**Общее состояние**: " + weather[1] + "\n**Температура**: " + temp[1] + "°C\n**Давление**: " + pressure[1] + "мм.рт.с\n**Влажность**: " + humidity[1] + "%\n**Ветер " + degnorm[1] + "**: " + wspeed[1] + "м/с",
          inline: true
        },
        {
          name: "Информация на " + dt_txt[2],
          value: "**Общее состояние**: " + weather[2] + "\n**Температура**: " + temp[2] + "°C\n**Давление**: " + pressure[2] + "мм.рт.с\n**Влажность**: " + humidity[2] + "%\n**Ветер " + degnorm[2] + "**: " + wspeed[2] + "м/с",
          inline: true
        },
        {
          name: "Информация на " + dt_txt[3],
          value: "**Общее состояние**: " + weather[3] + "\n**Температура**: " + temp[3] + "°C\n**Давление**: " + pressure[3] + "мм.рт.с\n**Влажность**: " + humidity[3] + "%\n**Ветер " + degnorm[3] + "**: " + wspeed[3] + "м/с",
          inline: true
        }
      ]
    }});  
  }
  }).catch(error =>{
    message.channel.send("Что-то пошло не так... Прикрепляю ответ API: " + error.response.status + " - " + error.response.statusText);
  })
    }
}