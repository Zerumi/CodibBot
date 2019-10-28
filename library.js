const User = require('discord.js').User
module.exports = {
    /**
     * @param {User} user 
     */
    checkAvatar(user){
        if (!user.avatarURL) {
            return user.defaultAvatarURL;
        }
        else
        {
            return user.avatarURL;
        }
    },
    /**
     * @param {string} mention 
     */
    slowflakehandle(mention){
        mention = mention.replace('<','');
        mention = mention.replace('>','');
        mention = mention.replace('@','');
        mention = mention.replace('!','');
        return mention;
    }
}