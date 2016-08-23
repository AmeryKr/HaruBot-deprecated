"use strict";
const serverSettingsHelper = require("../databases/helpers/serversettings.js");
const permissionsHelper = require("../databases/helpers/permissions.js");
const helpHelper = require("./help.js"); /* Redundancy? Where? */
const logHelper = require("./log.js");
const commands = require('../data/commandLoader.js').commands;
const auth = require('../auth.json');

let cooldownHelper = require("./cooldown.js");

/**
 * Handles message events for commands.
 * @arg {Discordie} Client - the current Discordie Client
 * @arg {IMessage} msg - The message interface.
 */
exports.messageHelper = function (Client, msg) {
	/* Check db for custom prefix */
	let prefix;
	serverSettingsHelper.checkForCustomPrefix(msg).then(pref => {
		prefix = pref;

		/* Ignore messages that are not command triggers */
		if (msg.content.indexOf(prefix) !== 0) return;

		let cmdText = msg.content.split(" ")[0].substr(prefix.length).toLowerCase();
		let args = msg.content.substr(prefix.length + cmdText.length + 1);

		if (cmdText === "help") {
			helpHelper.helpHandler(msg, args, commands);
		}

		if (commands[cmdText]) {
			let command = commands[cmdText]; /* This is the actual command object thing! */

			if (command.levelReq === 'owner') {
				if (auth.botOwner.indexOf(msg.author.id) > -1) {
					logHelper.ownerCommand(msg.guild.name, msg.author.username, cmdText, args);
					try {
						command.exec(Client, msg, args);
					} catch (e) {
						msg.channel.sendMessage(":interrobang: There was an error while executing that command. Check console for details.");
						console.log(e);
					}
				} else {
					msg.channel.sendMessage(":no_entry: Sorry, this command is only for the bot owner.");
				}
			}
			
			if (!msg.isPrivate) {
				cooldownHelper.checkCooldown(command, msg.guild.id, msg.author.id).then(time => {
					if (time === true) {
						permissionsHelper.checkPermissions(msg, msg.author, msg.author.memberOf(msg.guild).roles).then(level => {
							if (level >= command.levelReq) {
								try {
									logHelper.command(msg.guild.name, msg.author.username, cmdText, args);
									command.exec(Client, msg, args);
								} catch (er) {
									msg.channel.sendMessage(":interrobang: There was an error while executing that command. Error:\n```xl\n" + er + "```");
									console.log(er);
								}
							} else {
								msg.channel.sendMessage(":no_entry_sign: Sorry, you don't have enough permission to run this command.");
							}
						}).catch(err => {
							msg.channel.sendMessage(":interrobang: There was an error while retrieving permissions. Error:\n```xl\n" + err + "```");
							console.log(err);
						});
					} else {
						msg.channel.sendMessage(":hand::skin-tone-1: That command is on cooldown for **" + time + "** more seconds!");
						return;
					}
					
				});
			} else {
				if (command.hasOwnProperty("DM") && command.DM) {
					try {
						command.exec(Client, msg, args);
					} catch (e) {
						msg.channel.sendMessage(":interrobang: There was an error while executing that command. Check console for details.");
						console.log(e);
					}
				} else {
					msg.channel.sendMessage("Sorry, this command cannot be used in DMs.");
				}
			}
		}
	});
}
