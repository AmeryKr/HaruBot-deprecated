'use strict';
/**
 * Help Handler
 * This file handles help. What did you expect? Magic? No, this is code.
 * :T
 */
const auth = require('../auth.json');

/**
 * Handles help, sends a message accordingly.
 * @arg {IMessage} msg - Message interface
 * @arg {String} args - Message arguments
 * @arg {Array<Object>} commands - Array of command objects
 */
exports.helpHandler = function (msg, args, commands) {
	if (!args) {
		let helpArray = [];

		helpArray.push('# HaruBot Help #');
		helpArray.push('Note: for more detailed help on a specific command, do `help [command name]` in any server.');

		let cmdByModule = {};

		for (let current in commands) {
			if (!cmdByModule[commands[current].module]) {
				cmdByModule[commands[current].module] = [];
			}

			if (commands[current].levelReq === 'owner') continue;

			let entry = '[' + commands[current].name + ']';

			if (commands[current].hasOwnProperty('help')) {
				entry += '(' + commands[current].help + ')';
			}

			if (commands[current].hasOwnProperty('usage') && commands[current].usage !== '') {
				entry += '\n<Usage>: ' + commands[current].name + ' ' + commands[current].usage;
			}

			cmdByModule[commands[current].module].push(entry);
		}

		for (let module in cmdByModule) {
			helpArray.push('[' + module + ']:');
			for (let helpEntry of cmdByModule[module]) {
				helpArray.push(helpEntry + '\n');
			}
		}

		let helpString = helpArray.join('\n');

		if (helpString.length > 1990) {
			let searchesIndex = helpString.indexOf('[Searches]:');
			let hsP1 = helpString.substring(0, searchesIndex - 1);
			let hsP2 = helpString.substring(searchesIndex);
			
			msg.author.openDM().then(dmchannel => {
				dmchannel.sendMessage('```md\n' + hsP1 + '```');
				dmchannel.sendMessage('```md\n' + hsP2 + '```');
			});

			return;
		}

		msg.author.openDM().then(dmchannel => {
			dmchannel.sendMessage('```md\n' + helpArray.join('\n') + '```');
		});
	} else {
		if (!commands[args]) {
			msg.channel.sendMessage(':warning: Command `' + args + '` is invalid.');
			return;
		}

		if (commands[args].levelReq === 'owner' && auth.botOwner.indexOf(msg.author.id) === -1) {
			msg.channel.sendMessage(':no_entry_sign: This command is for the bot owner only.');
			return;
		}

		let helpArray = [];
		let commandObject = commands[args];

		helpArray.push('       [Command]: ' + commandObject.name);
		helpArray.push('   [Description]: "' + commandObject.help + '"');
		helpArray.push('         [Usage]: "' + commandObject.name + ' ' + commandObject.usage + '"');
		helpArray.push('[Level Required]: ' + commandObject.levelReq);
		helpArray.push('      [Cooldown]: ' + commandObject.cooldown + ' seconds.');

		msg.channel.sendMessage('```ruby\n' + helpArray.join('\n') + '```');
	}
}