'use strict';
const superagent = require("superagent");
const serverSettings = require("../databases/helpers/serversettings.js");

/**
 * Sends a request to update the bot's server count on bots.discord.pw
 * @arg {String} clientID - Bot's ID
 * @arg {Number} guilds - Number of guilds
 * @arg {String} token - Abal token ;)
 */
exports.updateServerCount = function (clientID, guilds, token) {
	superagent.post(`https://bots.discord.pw/api/bots/${clientID}/stats`).set("Authorization", token).type("application/json")
	.send({ "server_count": guilds}).end(er => {
		console.log("Updated bot server count in bots.discord.pw.");
		if (er) {
			console.log(er);
		}
	});
}

exports.handlePresenceUpdate = function (Client, oldUser, newUser) {
	let botGuilds = Client.Guilds;
	let user = Client.Users.get(newUser.id);

	console.log(oldUser)
	console.log(newUser)

	botGuilds.forEach(currentGuild => {
		if (user.memberOf(currentGuild)) {
			serverSettings.checkLogging(currentGuild).then(res => {
				if (res !== "DISABLED") {
					let logChannel = currentGuild.textChannels.find(k => k.id === res);
					let changesString = "";

					/* If there's a username difference */
					if (newUser.username !== oldUser.username) {
						changesString += "Old Username: \"" + oldUser.username + "\"\n";
						changesString += "New Username: \"" + newUser.username + "\"\n";
					} else {
						changesString += "Username: \"" + oldUser.username + "\"\n";
					}

					/* If there's a discriminator difference */
					if (newUser.discriminator !== oldUser.discriminator) {
						changesString += "Old Discrim.: " + oldUser.discriminator + "\n";
						changesString += "New Discrim.: " + newUser.discriminator + "\n";
					} else {
						changesString += "Discriminator: " + oldUser.discriminator + "\n";
					}

					/* If there's an avatar difference */
					if (newUser.avatar !== oldUser.avatar) {
						changesString += "Old Avatar: \"http://cdn.discordapp.com/avatars/" + oldUser.id + "/" + oldUser.avatar + ".jpg\"\n";
						changesString += "New Avatar: \"http://cdn.discordapp.com/avatars/" + newUser.id + "/" + newUser.avatar + ".jpg\"\n";
					}

					logChannel.sendMessage(":up: **A member has been updated**! Details:\n```xl\n" + changesString + "```");
				}
			}).catch(e => {
				console.log(e);
			});
		}
	});
}
