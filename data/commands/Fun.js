"use strict";
let commandsInModule = [];
let unirest = require('unirest');

const auth = require("../../auth.json");
const pats = require("../lists/pats.js").pats;

commandsInModule.pat = {
	name: 'pat', module: 'Fun',
	help: 'Pats a user!',
	usage: '[@user/user]',
	cooldown: 10, levelReq: 0,
	exec: function (Client, msg, args) {
		if (msg.mentions.length <= 0) {
			/* We need to fetch all the members to search in a broader list */
			Client.Users.fetchMembers();

			let userObj = Client.Users.getBy("username", args);

			if (!userObj) {
				msg.channel.sendMessage(":warning: User `" + args + "` doesn't seem to exist.");
				return;
			}

			let guildUserObj = userObj.memberOf(msg.guild);

			if (!guildUserObj) {
				msg.channel.sendMessage(":warning: User `" + args + "` doesn't seem to exist.");
				return;
			}

			msg.channel.sendMessage(guildUserObj.mention + " you have been patted by " + msg.author.mention + "\n" +
			pats[Math.floor(Math.random() * pats.length)]);
		} else {
			if (msg.mentions.length > 1) {
				msg.channel.sendMessage(":confounded: Sorry, I can only pat one user at a time.");
				return;
			}

			let guildUserObj = msg.mentions[0].memberOf(msg.guild);

			if (!guildUserObj) {
				msg.channel.sendMessage(":warning: User tagged is not a valid member of the guild!");
				return;
			}

			msg.channel.sendMessage(guildUserObj.mention + " you have been patted by " + msg.author.mention + "\n" +
			pats[Math.floor(Math.random() * pats.length)]);
		}
	}
}

commandsInModule.ud = {
	name: 'ud', module: 'Fun',
	help: 'Looks up a definition on Urban Dictionary.',
	usage: '[search terms]',
	cooldown: 30, levelReq: 0,
	exec: function (Client, msg, args) {
		if (!args) {
			msg.channel.sendMessage(":warning: No arguments specified!");
		}

		let definitionURL = "https://mashape-community-urban-dictionary.p.mashape.com/define?term=" + args.split(" ").join("+");

		unirest.get(definitionURL).header("X-Mashape-Key", auth.mashapeKey)
		.header("Accept", "text/plain")
		.end(function (result) {
			if (result.status === 200) {
				if (result.body) {
					let msgArray = [];
					let topResult = result.body.list[0];

					msgArray.push("__**Search terms**__: **" + args + "**");
					msgArray.push("__**Definition**__: " + topResult.definition);
					msgArray.push("__**Example**__:\n*" + topResult.example + "*");
					msgArray.push("__**Author**__: " + topResult.author);
					msgArray.push("__**Thumbs Up**__: " + topResult.thumbs_up + " | __Thumbs Down__: " + topResult.thumbs_down);
					msgArray.push("<" + topResult.permalink + ">");
					
					msg.channel.sendMessage(msgArray.join("\n"));
				}
			} else {
				msg.channel.sendMessage(":warning: Something went wrong while trying to get the definition, or it doesn't exist!");
			}
		});
	}
}

exports.commandsInModule = commandsInModule;