"use strict";
const chalk = require('chalk');

/**
 * Log connection
 * @arg {Object} Client - Client Object
 * @arg {Number} servers - Number of cached servers
 * @arg {Number} users - Number of cached users
 * @arg {Number} channels - Number of cached channels
 */
exports.connection = function (Client, servers, users, channels) {
	console.log(
		chalk.bgYellow(' HaruBot is ready \n') +
		'Currently connected to ' + chalk.green(servers) + ' servers, ' +
		'looking at ' + chalk.green(channels) + ' channels, ' +
		'and serving ' + chalk.green(users) + ' users.\n' +
		'Logged in as: ' + Client.User.username + '#' + Client.User.discriminator
	);
}

/**
 * Log command
 * @arg {String} server - Server name
 * @arg {String} user - Command cast username
 * @arg {String} command - Command name
 * @arg {String} args - Additional arguments for command
 */
exports.command = function (server, user, command, args) {
	console.log(
		chalk.bgCyan(' ' + server + ' ') + ' > ' + chalk.cyan(user) + '\n' +
		'Command Executed: ' + chalk.green(command) + '\n' +
		'Additional Arguments: ' + chalk.bold(args) + '\n'
	);
}

/**
 * Log owner command
 * @arg {String} server - Server name
 * @arg {String} user - Command cast username
 * @arg {String} command - Command name
 * @arg {String} args - Additional arguments for command
 */
exports.ownerCommand = function (server, user, command, args) {
	console.log(
		chalk.bgGreen(' ' + server + ' ') + ' > ' + chalk.green(user) + '\n' +
		'Command Executed: ' + chalk.green(command) + '\n' +
		'Additional Arguments: ' + chalk.bold(args) + '\n'
	);
}

/**
 * Logs help usage to the console
 * @arg {IMessage} msg - Message interface
 * @arg {String} args - Additional arguments
 */
exports.logHelp = function (msg, args) {
	console.log(
		chalk.bgMagenta(' ' + msg.guild.name + ' ') + ' > ' + chalk.magenta(msg.author) + '\n' +
		chalk.bold.green('Help Requested') + '\n' +
		'Additional Arguments: ' + chalk.bold(args) + '\n'
	);
}