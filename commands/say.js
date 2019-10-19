const Message = require('discord.js').Message;
module.exports = {
    name: "say",
    description: "Say",
    /**
     * @param {Message} message 
     * @param {Array<string>} args 
     */
    execute(message,args){
        if (args[0] === "") {
            return message.channel.send("Использование !say Текст\nили !say Первая строка | Вторая строка...");
        }
        message.channel.send(args);
    }
}