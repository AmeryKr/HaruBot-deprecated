'use strict';
const superagent = require("superagent");

/**
 * Sends a request to update the bot's server count on bots.discord.pw
 * @arg {String} clientID - Bot's ID
 * @arg {Number} guilds - Number of guilds
 * @arg {String} token - Abal token ;)
 */
exports.updateServerCount = function (clientID, guilds, token) {
	superagent.post(`https://bots.discord.pw/api/bots/${ID}/stats`).set("Authorization", token).type("application/json")
	.send({guilds}).end(er => {
		console.log("Updated bot server count in bots.discord.pw.");
		if (er) {
			console.log(er);
		}
	});
}
