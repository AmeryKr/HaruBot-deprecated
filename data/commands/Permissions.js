"use strict";
let commandsInModule = [];
const Permissions = require("../../databases/helpers/permissions.js");

commandsInModule.level = {
	name: 'level', module: 'Permissions',
	help: 'Sets the level of a role. Level can be either -1, 1, 2, or 3.',
	usage: '[level] [role name/@role]',
	cooldown: 5, levelReq: 3,
	exec: function (Client, msg, args) {
		let arg = args.split(" ");

		if (isNaN(arg[0]) && (arg[0] > 3 || arg[0] < -1)) {
			msg.channel.sendMessage(":warning: First parameter should be either -1, 1, 2, or 3.");
			return;
		}

		if (msg.mention_roles.length <= 0) {
			let query = args.substr(arg[0].length + 1);
			let role = msg.guild.roles.find(k => k.name === query);

			if (!role) {
				msg.channel.sendMessage(":interrobang: Role name is invalid! I recommend @mentioning the role.");
				return;
			}

			let levelString = "level" + arg[0];

			Permissions.updatePermissions(msg.guild, role.id, levelString).then(r => {
				if (r) msg.channel.sendMessage(":white_check_mark: Successfully set role **" + role.name + "** to level **" + arg[0] + "**.");
			}).catch(e => {
				console.log(e);
				msg.channel.sendMessage(":interrobang: An error occurred while running this command! Error:```xl\n" + e + "```");
			});
		} else {
			let levelString = "level" + arg[0];
			msg.mention_roles.map(q => {
				Permissions.updatePermissions(msg.guild, q.id, levelString).then(r => {
					if (r) msg.channel.sendMessage(":white_check_mark: Successfully set role **" + q.name + "** to level **" + arg[0] + "**.");
				}).catch(e => {
					console.log(e);
					msg.channel.sendMessage(":interrobang: An error occurred while running this command! Error:```xl\n" + e + "```");
				});
			});
		}
	}
}

exports.commandsInModule = commandsInModule;