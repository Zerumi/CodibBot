module.exports = {
    name: "say",
    description: "Say",
    execute(message,args){
        if (args[0] === "") {
            return message.channel.send("Использование !say Текст\nили !say Первая строка | Вторая строка...");
        }
        message.channel.send(args);
    }
}