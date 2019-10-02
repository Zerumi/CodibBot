const aa = require('discord.js').Message
module.exports = {
    name: "vedit",
    description: "Vote edit",
    execute(message,args){
        if (args[0] === "" || !args.length === 2) {
            return message.channel.send("Использование: !vedit id сообщения голосования | Новая тема голосования");
        }
        message.channel.fetchMessage(args[0]).then(r => {
            if (!r.author.id === "603999060726120448") {
                return message.channel.send("Использование: !vedit id сообщения голосования | Новая тема голосования");
            }
            var oldtitle = r.embeds[0].title.substr("Голосование: ".length)
            var title = r.embeds[0].title.replace(oldtitle,args[1])
            var description = r.embeds[0].description;
            if (description.split(' ')[2] !== "<@" + message.author.id + ">.") {
                return message.channel.send("Использовать это можно только создателю голосования. Создайте своё голосование с помощью !vote");
            }
            var footertext = r.embeds[0].footer.text;
            var count = 0;
            if (footertext.includes("Голосование изменено")) {
                count = parseInt(footertext.split(' ')[2]);
            }
            var timestamp = r.embeds[0].timestamp;
            var date = Date.now()
            if ((Date.parse(timestamp) + 600000) < date) {
                return message.channel.send("Голосование нельзя изменить через 10 минут после его начала");
            }
            footertext = "Голосование изменено " + (count + 1) + declOfNum((count + 1), [" раз", " раза", " раз"]) + ". Голосование началось";
            r.edit({
                embed: {
                    title: title,
                    description: description,
                    footer: {
                        text: footertext
                    },
                    timestamp: new Date(Date.now())
                }
            })
            r.channel.send("@everyone");
            r.channel.send({
                embed: {
                    title: "Голосование №" + r.id + " было изменено!",
                    description: "Старая тема голосования: " + oldtitle + "\nНовая тема голосования: " + title.substr("Голосование: ".length),
                    footer: {
                        text: "Голосование измненилось в " + (count + 1) + "й раз"
                    },
                    timestamp: new Date(Date.now()),
                    url: "https://discordapp.com/channels/" + r.guild.id + "/" + r.channel.id +"/" + r.id
                }
            })
        })
    }
}
function declOfNum(number, titles) {  
    // использование: declofnum(число, массив)
    // массив из 3 элементов: тип склонения при числе(1е слово: "1 ...", 2е "3 ...",, 3е "5 ...")
    cases = [2, 0, 1, 1, 1, 2];  
    return titles[ (number%100>4 && number%100<20)? 2 : cases[(number%10<5)?number%10:5] ];  
}