module.exports = {
	name: 'ping',
	description: 'Ping!',
	execute(message, args) {
        message.channel.send({ embed : {
        title: "PONG!",
        description: "Uptime: " + message.client.uptime + "ms\nPing: " + message.client.ping + "ms\nServer Count: " + message.client.guilds.array().length,
        color: 3066993,
        timestamp: message.client.readyTimestamp,
        footer:
        {
          text: "Бот работает с"
        }
      }})
	},
};