"use strict";
let commandsInModule = [];
const Permissions = require("../../databases/helpers/permissions.js");

commandsInModule.prune = {
	name: 'prune', module: 'Moderation',
	help: 'Deletes up to 100 messages from the current channel.',
	usage: '[1-100]',
	cooldown: 5, levelReq: 2,
	exec: function (client, msg, args) {
		if (!msg.author.permissionsFor(msg.guild).Text.MANAGE_MESSAGES) {
			msg.channel.sendMessage(':pensive: You don\'t have permission to delete messages on this server!');
			return;
		}
		
		if (!client.User.permissionsFor(msg.guild).Text.MANAGE_MESSAGES) {
			msg.channel.sendMessage(':sob: I don\'t have permission to delete messages on this server!');
			return;
		}

		if (!args || isNaN(args) || args < 1 || args > 100) {
			msg.channel.sendMessage(':warning: The parameter for this command should be a number between 1 and 100.');
		}

		msg.channel.fetchMessages(args, msg).then((result) => {
			client.Messages.deleteMessages(result.messages);
			msg.channel.sendMessage(':white_check_mark: Succesfully deleted **' + args + '** messages from this channel.');
			msg.delete();
		}).catch(e => {
			console.log(e);
		});
	}
}

commandsInModule.clean = {
	name: 'clean', module: 'Moderation',
	help: 'Deletes bot messages in the last 40 total messages.',
	usage: '',
	cooldown: 20, levelReq: 2,
	exec: function (client, msg, args) {
		if (!msg.author.permissionsFor(msg.guild).Text.MANAGE_MESSAGES) {
			msg.channel.sendMessage(':pensive: You don\'t have permission to delete messages on this server!');
			return;
		}
		
		if (!client.User.permissionsFor(msg.guild).Text.MANAGE_MESSAGES) {
			msg.channel.sendMessage(':sob: I don\'t have permission to delete messages on this server!');
			return;
		}

		msg.channel.fetchMessages(40).then((result) => {
			let messagesToDelete = result.messages.filter(item => item.author.id === client.User.id);
			client.Messages.deleteMessages(messagesToDelete);
			msg.channel.sendMessage(':white_check_mark: Succesfully deleted **' + messagesToDelete.length + '** bot messages from this channel.');
		});
	}
}

commandsInModule.setmute = {
	name: 'setmute', module: 'Moderation',
	help: 'Sets the mute role for the mute command.',
	usage: '[@role/role name]',
	cooldown: 5, levelReq: 3,
	exec: function (client, msg, args) {
		if (!args && msg.mention_roles.length <= 0) {
			msg.channel.sendMessage(":warning: You didn't mention nor name any roles.");
			return;
		}

		let newMuteRole;

		if (msg.mention_roles.length === 1) {
			newMuteRole = msg.mention_roles[0];
		} else if (msg.mention_roles.length > 1) {
			msg.channel.sendMessage(":warning: You can only set one role.");
			return;
		} else {
			newMuteRole = msg.guild.roles.find(r => r.name === args);
		}

		/* Null check */
		if (!newMuteRole) {
			msg.channel.sendMessage(":bangbang: The role you chose doesn't exist. Remember that role names are Case Sensitive.");
			return;
		}

		Permissions.setMuteRole(msg.guild, newMuteRole.id).then(r => {
			if (r) msg.channel.sendMessage(":white_check_mark: Successfully set the muted role to `" + newMuteRole.name + "`");
		}).catch(e => {
			console.log(e);
			msg.channel.sendMessage(':interrobang: Something went terribly wrong while trying to update the muted role. Stack:\n```xl\n' + e.stack + '```');
		});
	}
}

commandsInModule.mute = {
	name: 'mute', module: 'Moderation',
	help: 'Mutes a user for a determined amount of time. If no time is specified, the default is 1 minute.',
	usage: '[@user] [minutes]',
	cooldown: 5, levelReq: 3,
	exec: function (Client, msg, args) {
		if (!msg.author.permissionsFor(msg.guild).General.MANAGE_ROLES) {
			msg.channel.sendMessage(':pensive: You do not have permission to edit roles in this server!');
			return;
		}

		if (!Client.User.permissionsFor(msg.guild).General.MANAGE_ROLES) {
			msg.channel.sendMessage(':sob: I do not have permission to edit roles in this server!');
			return;
		}

		if (msg.mentions.length <= 0) {
			msg.channel.sendMessage(':warning: You did not mention a user!');
			return;
		}

		let time = (args.split(" ")[msg.mentions.length] * 60 * 1000) || (60 * 1000); /* If no time is specified, we default to 1 minute */

		Permissions.getMuteRole(msg.guild).then(r => {
			let muteRole = msg.guild.roles.find(k => k.id === r);
			
			if (!muteRole) {
				msg.channel.sendMessage(':warning: No mute role has been set! Set it with `setmute [Role Name/@Role]`');
				return;
			}

			msg.mentions.map(u => {
				let member = msg.guild.members.find((m) => m.id === u.id);

				member.assignRole(muteRole).then(() => {
					msg.channel.sendMessage(':white_check_mark: Member `' + member.username + '#' + member.discriminator + '` has been muted for ' + (time / 1000 / 60) + ' minutes.')
				}).catch(er => {
					console.log(er);
				});

				setTimeout(() => {member.unassignRole(muteRole)}, time);
			});
		}).catch(e => {
			console.log(chalk.bgRed(' DB CHECK ERROR ') + '\n' + e);
			msg.channel.sendMessage(':interrobang: Woah! Something went wrong while fetching the mute role from the database!. Stack:\n```xl\n' + e.stack + '```');
		});
	}
}

exports.commandsInModule = commandsInModule;