const Message = require('discord.js').Message;
module.exports = {
    name: "usersinfo",
    description: "Users info",
    /**
     * @param {Message} message 
     * @param {Array<string>} args 
     */
    execute(message,args){
        var count = {
            "online": 0,
            "idle": 0,
            "dnd": 0,
            "offline": 0
        };
        var arrbots = [];
        message.guild.members.map(member => member.user.bot).forEach(function (entry,i){
            if (entry === true) {
                arrbots.push(i);
            }
        })
        var userstatus = message.guild.members.map(user => user.user.presence.status)
        for (let i = 0; i < arrbots.length; i++) {
            const element = arrbots[i];
            for (let j = 0; j < userstatus.length; j++) {
                if (element === j) {
                    userstatus[j] = userstatus[j].replace(userstatus[j].substr(0),"bot")
                }
            }
        }
        userstatus.forEach(function(i) {count[i] = (count[i]||0) + 1;})
        message.channel.send({
            embed: {
                title: "Список избирателей (исключая " + arrbots.length + " ботов)", // make block ban/kick votes in closed for @everyone channels (and !vote not for ban)
                description: `${message.client.emojis.find(e => e.name === "online")}` + "Участников в валидации: " + count.online + `\n${message.client.emojis.find(e => e.name === "away")}` + "Участников в спящем режиме: " + count.idle + `\n${message.client.emojis.find(e => e.name === "dnd")}` + "Участников в режиме медитации: " + count.dnd + `\n${message.client.emojis.find(e => e.name === "offline")}` + "Участников в отъезде: " + count.offline,
                footer: {
                    text: "О голосовании придет информация " + (userstatus.length - count.dnd - arrbots.length) + " людям"
                },
                timestamp: new Date(Date.now())
            }
        }).then(mes => {
            setTimeout(() => {
                mes.delete();
            }, 5000);
        })
    }
}