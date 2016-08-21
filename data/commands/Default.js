"use strict";
let commandsInModule = [];
const Permissions = require("../../databases/helpers/permissions.js");
const ServerSettings = require("../../databases/helpers/serversettings.js");
const chalk = require('chalk');

commandsInModule.ping = {
	name: 'ping', module: 'Default',
	help: 'Replies to your message with a pong!',
	usage: '',
	cooldown: 5, levelReq: 0,
	exec: function (Client, msg, args) {
		let currentDate = Date.now();
		msg.reply('*pong!*').then((bm, error) => {
			let delay = Date.now() - currentDate;

			bm.edit(msg.author.mention + ', *pong!*\nReplied in: **' + delay + '**ms.');
		});
	}
}

commandsInModule.info = {
	name: 'info', module: 'Default',
	help: 'Gets info on the bot.',
	usage: '',
	cooldown: 5, levelReq: 0,
	exec: function (Client, msg, args) {
		let dateNow = Date.now();
		let uptime = new Date(dateNow - Client.User.createdAt);

		msg.reply("hi! I'm **" + Client.User.username + "**!\nI'm currently in **" + Client.Guilds.length + "** servers, having tons of fun and splashing water on **" + Client.Users.length +
		"** users >:D I'm also looking at **" + Client.Channels.length + "** channels! I've been up for " + uptime.getHours() + " hours, " + uptime.getMinutes() + " minutes and " +
		uptime.getSeconds() + " seconds.");
	}
}

commandsInModule.serverinfo = {
	name: 'serverinfo', module: 'Default',
	help: 'Gets info on the server the command was ran in.',
	usage: '',
	cooldown: 5, levelReq: 0,
	exec: function (Client, msg, args) {
		var infoArray = [];

		infoArray.push('Server Name:      \"' + msg.guild.name + `\"`);
		infoArray.push('Server Owner:     ' + msg.guild.owner.username + '#' + msg.guild.owner.discriminator);
		infoArray.push('Roles:            ' + msg.guild.roles.length);
		infoArray.push('Text Channels:    ' + msg.guild.textChannels.length);
		infoArray.push('Voice Channels:   ' + msg.guild.voiceChannels.length);
		infoArray.push('Members:          ' + msg.guild.member_count);
		infoArray.push('Default Channel:  ' + msg.guild.generalChannel.name);
		infoArray.push('Created:          ' + msg.guild.createdAt.toUTCString());
		infoArray.push('Icon URL:         \"' + msg.guild.iconURL + '\"');

		msg.channel.sendMessage('```xl\n' + infoArray.join('\n') + '```');
	}
}

commandsInModule.userinfo = {
	name: 'userinfo', module: 'Default',
	help: 'Gets info on a user. If no user is mentioned, it gets info on the message author.',
	usage: '[@user/userID]',
	cooldown: 5, levelReq: 0,
	exec: function (Client, msg, args) {
		var infoArray = [];
		var userObj, isBot, userJoined;

		if (msg.mentions.length <= 0) {
			if (args) {
				if (/\d{17,18}/.test(args.split(" ")[0])) {
					userObj = client.Users.getMember(msg.guild, args.split(" ")[0]);
					isBot = userObj.bot ? "yes" : "no";
					userJoined = correctDate(userObj.memberOf(msg.guild).joined_at);
				} else {
					msg.channel.sendMessage(':warning: The user ID provided is invalid.');
					return;
				}
			} else {
				userObj = msg.author;
				isBot = userObj.bot ? "yes" : "no";
				userJoined = correctDate(userObj.memberOf(msg.guild).joined_at);
			}
		} else {
			if (msg.mentions.length > 1) { msg.channel.sendMessage(':confounded: To prevent spam, please do 1 user at a time.'); return; }
			userObj = msg.mentions[0];
			isBot = userObj.bot ? "yes" : "no";
			userJoined = correctDate(userObj.memberOf(msg.guild).joined_at);
		}

		infoArray.push('     Username: ' + userObj.username + '#' + userObj.discriminator);
		infoArray.push('           ID: ' + userObj.id);
		infoArray.push('  Bot Account: ' + isBot);
		infoArray.push('   Registered: ' + userObj.registeredAt.toUTCString());
		infoArray.push('Joined Server: ' + userJoined);
		infoArray.push('       Status: ' + userObj.status);
		infoArray.push('   Avatar URL: \"' + userObj.avatarURL + '\"');

		msg.channel.sendMessage('```xl\n' + infoArray.join('\n') + '```\n' + userObj.avatarURL);
	}
}

commandsInModule.eval = {
	name: 'eval', module: 'Default',
	help: 'Runs arbitrary JS code and gives back the results.',
	usage: '[code]',
	cooldown: 0, levelReq: 'owner',
	exec: function (client, msg, args) {
		var result;

		try {
			result = eval("try{" + args + "} catch (error) { console.log(\"EVAL\" + error); msg.channel.sendMessage(\"```\" + error + \"```\") }");
		} catch (err) {
			console.log(chalk.bgRed("EVAL CATCH") + err);
			msg.channel.sendMessage("```" + err + "```");
		}

		if (result && typeof result !== 'object') { msg.channel.sendMessage("```" + result + "```") }
		else if (result && typeof result === 'object') { msg.channel.sendMessage("```xl\n" + result + "```") }
	}
}

commandsInModule.initserver = {
	name: 'initserver', module: 'Default',
	help: '', usage: '', cooldown: 0, levelReq: 'owner',
	exec: function (Client, msg, args) {
		Permissions.initializePermissions(msg.guild).then(r => {
			if (r === 'Ok') {
				msg.channel.sendMessage(":white_check_mark: Successfully initialized Permissions database.");
			}
		}).catch(e => {
			msg.channel.sendMessage(":interrobang: There was an error while initializing Permissions database!");
		});

		ServerSettings.initializeServerSettings(msg.guild).then(r => {
			if (r === 'Ok') {
				msg.channel.sendMessage(":white_check_mark: Successfully initialized ServerSettings database.");
			}
		}).catch(e => {
			msg.channel.sendMessage(":interrobang: There was an error while initializing ServerSettings database!");
		});
	}
}

exports.commandsInModule = commandsInModule;

function correctDate (stringDate) {
	var date = new Date(stringDate);
	var dateUNIX = date.toUTCString();
	return dateUNIX;
}