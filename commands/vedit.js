const Message = require('discord.js').Message;
const discord = require('discord.js');
module.exports = {
    name: "vedit",
    description: "Vote edit",
    /**
     * @param {Message} message 
     * @param {Array<string>} args 
     */
    async execute(message, args){
        var arrmessages = [];
        var messagesid = [];
        var fetched = await message.channel.fetchMessages({limit: 100});
        const botMessages = fetched.filter(msg => msg.author.id === "603999060726120448");
        for (let i = 0; i < botMessages.array().length; i++) {
            const element = botMessages.array()[i];
            if (element.embeds.length === 0) {
                continue;
            }
            else if (element.embeds[0].footer === null) {
                continue;
            }
            else if (element.embeds[0].footer.text.includes("Голосование началось")) {
                arrmessages.push(element.embeds[0].title.replace("Голосование: ", ""));
                messagesid.push(element.id);
            }
        }
        let embed = new discord.RichEmbed()
        .setTitle("Выберите голосование для изменения")
        .setFooter("У вас имеется 30 секунд на ввод новой темы голосования");
        arrmessages.forEach((entry,i) => {
            embed.addField(entry,"Чтобы выбрать голосование, используйте " + (i + 1) + " | Новая тема голосования",true)
        });
        if (embed.fields.length === 0) {
            return message.channel.send("Нечего менять");
        }
        return message.channel.send(embed).then(mes => {
            const filter = m => m.author.id === message.author.id;
            const collector = mes.channel.createMessageCollector(filter, { time: 40000, max: 1 });

            collector.on('collect', m => {
                message.channel.fetchMessage(messagesid[(parseInt(m.content) - 1)]).then(r => {
                    var oldtitle = r.embeds[0].title.substr("Голосование: ".length)
                    var title = r.embeds[0].title.replace(oldtitle,m.content.split(' | ')[1])
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
                    if ((Date.parse(timestamp.toString()) + 600000) < date) {
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
                    r.channel.send("@everyone", {
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
            });
        });
    }
}
function declOfNum(number, titles) {  
    // использование: declofnum(число, массив)
    // массив из 3 элементов: тип склонения при числе(1е слово: "1 ...", 2е "3 ...",, 3е "5 ...")
    var cases = [2, 0, 1, 1, 1, 2];  
    return titles[ (number%100>4 && number%100<20)? 2 : cases[(number%10<5)?number%10:5] ];  
}