"use strict";
let commandsInModule = [];
const ServerSettings = require("../../databases/helpers/serversettings.js");
const auth = require("../../auth.json");

commandsInModule.prefix = {
	name: 'prefix', module: 'Server Settings',
	help: 'Allows you to customize the server\'s prefix.',
	usage: '[enable/disable/set] (prefix) - Only include the prefix if you\'re setting it!',
	cooldown: 5, levelReq: 3,
	exec: function (Client, msg, args) {
		let whatToDo = args.split(" ")[0];
		let newPrefix = args.substr(whatToDo.length + 1) || "";

		if (whatToDo !== "enable" && whatToDo !== "disable" && whatToDo !== "set") {
			msg.channel.sendMessage(":interrobang: First argument should be either `enable`, `disable` or `set`");
			return;
		}

		if (/\s/.test(newPrefix)) {
			msg.channel.sendMessage(":bangbang: Sorry, you can't have space characters in the prefix!");
			return;
		}

		ServerSettings.updatePrefix(msg.guild, whatToDo, newPrefix).then(r => {
			if (r === 'Ok') {
				msg.channel.sendMessage(":white_check_mark: Prefix has been updated!");
			}
		}).catch(e => {
			console.log(e);
			msg.channel.sendMessage(":interrobang: An error has occurred while running this command. Error:```xl\n" + e + "```");
		});
	}
}

commandsInModule.greeting = {
	name: 'greeting', module: 'Server Settings',
	help: 'Allows you to customize the server\'s new member greeting.',
	usage: '[enable/disable/set] (greeting) - To mention the user, type $USER. To get the name of the server, type $SERVER.',
	cooldown: 5, levelReq: 3,
	exec: function (Client, msg, args) {
		let whatToDo = args.split(" ")[0];
		let newGreeting = args.substr(whatToDo.length + 1) || "";

		if (whatToDo !== "enable" && whatToDo !== "disable" && whatToDo !== "set") {
			msg.channel.sendMessage(":interrobang: First argument should be either `enable`, `disable` or `set`");
			return;
		}

		ServerSettings.updateGreeting(msg.guild, whatToDo, newGreeting).then(r => {
			if (r === 'Ok') {
				msg.channel.sendMessage(":white_check_mark: Greeting has been updated!");
			}
		}).catch(e => {
			console.log(e);
			msg.channel.sendMessage(":interrobang: An error has occurred while running this command. Error:```xl\n" + e + "```");
		});
	}
}

commandsInModule.log = {
	name: 'log', module: 'Server Settings',
	help: 'Allows you to customize the server\'s logging.',
	usage: '[enable/disable/set] (#channel)',
	cooldown: 5, levelReq: 3,
	exec: function (Client, msg, args) {
		let whatToDo = args.split(" ")[0];
		let logChannel;

		if (whatToDo !== "enable" && whatToDo !== "disable" && whatToDo !== "set") {
			msg.channel.sendMessage(":interrobang: First argument should be either `enable`, `disable` or `set`");
			return;
		}

		if (whatToDo === "set" && args.split(" ")[1]) {
			logChannel = args.split(" ")[1].replace(/\D/g, "");
		} else {
			logChannel = "";
		}

		ServerSettings.updateLogging(msg.guild, whatToDo, logChannel).then(r => {
			if (r === 'Ok') {
				msg.channel.sendMessage(":white_check_mark: Logging has been updated!");
			}
		}).catch(e => {
			console.log(e);
			msg.channel.sendMessage(":interrobang: An error has occurred while running this command. Error:```xl\n" + e + "```");
		});
	}
}

commandsInModule.ignore = {
	name: 'ignore', module: 'Server Settings',
	help: 'Makes the bot ignore the channel in which the command was typed in, or a specific user with an @mention',
	usage: '[@user] - Optional. If no user is mentioned, the current channel will be ignored',
	cooldown: 5, levelReq: 3,
	exec: function (Client, msg, args) {
		if (msg.mentions.length > 0) {
			msg.mentions.map(k => {
				if (auth.botOwner.indexOf(k.id) > -1) {
					msg.channel.sendMessage(":no_entry_sign: Can't ignore a bot owner!");
				} else if (msg.guild.owner_id === k.id) {
					msg.channel.sendMessage(":no_entry_sign: Can't ignore the server owner!");
				} else {
					ServerSettings.updateUserIgnore(msg.guild, "ignore", k.id).then(r => {
						if (r === 'Ok') {
							msg.channel.sendMessage(":white_check_mark: I am now ignoring user **" + k.username + "**");
						}
					}).catch(e => {
						console.log(e);
						msg.channel.sendMessage(":interrobang: An error has occurred while trying to run this command! Error:```xl\n" + e + "```");
					});
				}
			});
		} else if (msg.mentions.length === 0) {
			ServerSettings.updateChannelIgnore(msg.guild, "ignore", msg.channel.id).then(r => {
				if (r === 'Ok') {
					msg.channel.sendMessage(":white_check_mark: I am now ignoring this channel. (**" + msg.channel.name + "**)");
				}
			}).catch(e => {
				console.log(e);
				msg.channel.sendMessage(":interrobang: An error has occurred while trying to run this command! Error:```xl\n" + e + "```");
			});
		}
	}
}

commandsInModule.unignore = {
	name: 'unignore', module: 'Server Settings',
	help: 'Makes the bot stop ignoring the channel in which the command was typed in, or a specific user with an @mention',
	usage: '[@user] - Optional. If no user is mentioned, the current channel will be unignored',
	cooldown: 5, levelReq: 3,
	exec: function (Client, msg, args) {
		if (msg.mentions.length > 0) {
			msg.mentions.map(k => {
				ServerSettings.checkUserIgnore(msg.guild, k.id).then(isIgnored => {
					if (isIgnored) {
						ServerSettings.updateUserIgnore(msg.guild, "unignore", k.id).then(res => {
							if (res === "Ok") {
								msg.channel.sendMessage(":white_check_mark: User **" + k.username + "** is no longer being ignored.");
							}
						});
					} else {
						msg.channel.sendMessage(":warning: User **" + k.username + "** wasn't ignored to begin with!");
					}
				});
			});
		} else {
			ServerSettings.checkChannelIgnore(msg.guild, msg.channel.id).then(isIgnored => {
				if (isIgnored) {
					ServerSettings.updateChannelIgnore(msg.guild, "unignore", msg.channel.id).then(res => {
						if (res === "Ok") {
							msg.channel.sendMessage(":white_check_mark: This channel isn't being ignored anymore.");
						}
					});
				} else {
					msg.channel.sendMessage(":warning: This channel wasn't ignored to begin with!");
				}
			});
		}
	}
}

commandsInModule.setcolors = {
	name: 'setcolors', module: 'Server Settings',
	help: 'Enable or disable custom color roles on this server.',
	usage: '[enable/disable]',
	cooldown: 5, levelReq: 3,
	exec: function (Client, msg, args) {
		if (args !== "enable" && args !== "disable") {
			msg.reply("valid arguments for this command are: `enable` or `disable`.");
			return;
		}

		ServerSettings.updateColors(msg.guild, args).then(r => {
			if (r === 'Ok') {
				msg.channel.sendMessage(":white_check_mark: Self-assignable color roles are now **" + args + "d**.");
			}
		}).catch(e => {
			console.log(e);
			msg.channel.sendMessage(":interrobang: An error has occurred while trying to run this command! Error:```xl\n" + e + "```");
		});
	}
}

exports.commandsInModule = commandsInModule;
