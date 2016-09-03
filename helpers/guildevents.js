"use strict";
const chalk = require("chalk");
const fs = require("fs");
const serverSettings = require("../databases/helpers/serversettings.js");
const permissions = require("../databases/helpers/permissions.js");

/**
 * Handles the guild create event
 * @arg {IGuild} guild - Guild interface
 * @arg {Boolean} becameAvailable - Whether the guild has recovered from unavailable state
 */
exports.handleGuildCreateEvent = function (guild, becameAvailable) {
	serverSettings.initializeServerSettings(guild).then(r => {
		if (r === 'Ok') {
			console.log(chalk.bgYellow.black(" SERVER SETTINGS ") + " > Initialized guild: " + guild.name + " | "
			+ guild.id);
		}
	});

	permissions.initializePermissions(guild).then(r => {
		if (r === 'Ok') {
			console.log(chalk.bgYellow.black(" PERMISSIONS ") + " > Initialized guild: " + guild.name + " | "
			+ guild.id);
		}
	});

	setTimeout(() => {
		guild.generalChannel.uploadFile(fs.readFileSync("./helpers/welcome.gif"), "./helpers/welcome.gif", "Hi! I'm **HaruBot**, and I'm an alien! Thanks for inviting me to your server.\n" +
		"To know what I can do, simply type `haru;help` to get my help text in a DM. If you don't like my prefix, " +
		"you can change it by using the `prefix` command!");
	}, 1000);
}

/**
 * Handles the guild delete event
 * @arg {String} guildID - ID of the deleted Guild
 */
exports.handleGuildDeleteEvent = function (guildID) {
	serverSettings.deleteServerSettings(guildID).then(r => {
		if (r === 'Ok') {
			console.log(chalk.bgRed(" SERVER SETTINGS DATABASE ENTRY REMOVED ") + " > Guild ID: " + guildID);
		}
	}).catch(e => {
		console.log(e);
	});

	permissions.deletePermissions(guildID).then(r => {
		if (r === 'Ok') {
			console.log(chalk.bgRed(" PERMISSIONS DATABASE ENTRY REMOVED ") + " > Guild ID: " + guildID);
		}
	}).catch(e => {
		console.log(e);
	});
}

/**
 * Handles the new member event
 * @arg {IGuild} guild - Guild interface
 * @arg {IGuildMember} member - Guild member interface
 */
exports.handleNewMember = function (guild, member) {
	serverSettings.checkForGreeting(guild).then(r => {
		if (r !== "DEFAULT") {
			let welcomeMessage = r.replace(/\$USER/g, member.username).replace(/\$SERVER/g, guild.name)
			.replace(/\$MENTION/g, member.mention);

			guild.generalChannel.sendMessage(welcomeMessage);
		} else {
			guild.generalChannel.sendMessage(":wave::skin-tone-1: Hello there, " + member.mention +
			"! Welcome to **" + guild.name + "**! Remember to read the rules and have a good time here :D");
		}
	});

	serverSettings.checkLogging(guild).then(r => {
		if (r !== "DISABLED") {
			let logChannel = guild.textChannels.find(k => k.id === r);

			logChannel.sendMessage(":heavy_plus_sign: **New member has joined the server**\n```xl\n"
			+ "Username: \"" + member.username + "#" + member.discriminator + "\"\n"
			+ " User ID: " + member.id + "```");
		}
	});
}

/**
 * Handles the guild member remove event
 * @arg {IGuild} guild - Guild interface
 * @arg {IUser} user - User interface
 */
exports.handleMemberRemove = function (guild, user) {
	serverSettings.checkLogging(guild).then(r => {
		if (r !== "DISABLED") {
			let logChannel = guild.textChannels.find(k => k.id === r);

			logChannel.sendMessage(":heavy_minus_sign: **A member has been removed the server**\n```xl\n"
			+ "Username: \"" + user.username + "#" + user.discriminator + "\"\n"
			+ "User ID: " + user.id + "```\n" +
			"**NOTE**: this might mean the user got kicked or they left the server on their own.");
		}
	});
}

/**
 * Handles the member update event
 * @arg {IGuild} guild - Guild interface
 * @arg {IGuildMember} member - Guild member interface
 * @arg {Array<IRole>} rolesAdded - Roles added
 * @arg {Array<IRole>} rolesRemoved - Roles removed
 * @arg {String} previousNick - Previous nick String
 */
exports.handleMemberUpdate = function (guild, member, rolesAdded, rolesRemoved, previousNick) {
	serverSettings.checkLogging(guild).then(r => {
		if (r !== "DISABLED") {
			let logChannel = guild.textChannels.find(k => k.id === r);
			let detailsString = "";

			detailsString += "Username: \"" + member.username + "#" + member.discriminator + "\"\n";
			detailsString += "User ID: " + member.id + "\n";

			if (previousNick) {
				detailsString += "New Nickname: \"" + member.nick + "\"\n";
				detailsString += "Prev. Nickname: \"" + previousNick + "\"\n";
			}

			if (rolesAdded) {
				detailsString += "[Roles Added]:\n";
				for (let r of rolesAdded) {
					detailsString += "    \"" + r.name + "\"\n";
				}
			}

			if (rolesRemoved) {
				detailsString += "[Roles Removed]:\n";
				for (let r of rolesRemoved) {
					detailsString += "    \"" + r.name + "\"\n";
				}
			}

			logChannel.sendMessage(":up: **A member has been updated**! Details:\n```xl\n" + detailsString + "```");
		}
	});
}

/**
 * Handles the member ban event
 * @arg {IGuild} guild - Guild interface
 * @arg {IUser} user - User interface
 */
exports.handleBan = function (guild, user) {
	serverSettings.checkLogging(guild).then(r => {
		if (r !== "DISABLED") {
			let logChannel = guild.textChannels.find(k => k.id === r);

			logChannel.sendMessage(":bangbang: **A user has been banned from the server**! Details:\n```xl\n"
			+ "Username: \"" + user.username + "#" + user.discriminator + "\"\n"
			+ " User ID: " + user.id + "```");
		}
	});
}

/**
 * Handles the member unban event
 * @arg {IGuild} guild - Guild interface
 * @arg {IUser} user - User interface
 */
exports.handleUnban = function (guild, user) {
	serverSettings.checkLogging(guild).then(r => {
		if (r !== "DISABLED") {
			let logChannel = guild.textChannels.find(k => k.id === r);

			logChannel.sendMessage(":interrobang: **A user has been unbanned from the server**! Details:\n```xl\n"
			+ "Username: \"" + user.username + "#" + user.discriminator + "\"\n"
			+ " User ID: " + user.id + "```");
		}
	});
}
