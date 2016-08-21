"use strict";
var letoc = {}; /* NOTE: Last Execution Time Of Command */
const auth = require('../auth.json');

/**
 * Checks for cooldown on a specific user for a specific server.
 * @arg {Object} cmd - Command object
 * @arg {String} server - Server ID
 * @arg {String} user - User ID
 */
exports.checkCooldown = function (cmd, server, user) {
	return new Promise(resolve => {
		var result = true;

		if (auth.botOwner.indexOf(user) > -1) {
			return resolve(true);
		}

		if (cmd.hasOwnProperty('cooldown')) {
			if (letoc.hasOwnProperty(server)) {
				if (letoc[server].hasOwnProperty(cmd.name)) {
					var timeNow = new Date();
					var lastExecutedTime = new Date(letoc[server][cmd.name]);

					lastExecutedTime.setSeconds(lastExecutedTime.getSeconds() + cmd.cooldown);

					if (timeNow < lastExecutedTime) {
						result = (lastExecutedTime - timeNow) / 1000;
					} else {
						letoc[server][cmd.name] = new Date();
					}
				} else {
					letoc[server][cmd.name] = new Date();
				}
			} else {
				letoc[server] = {};
				letoc[server][cmd.name] = new Date();
			}
		}
		return resolve(result);
	});
}