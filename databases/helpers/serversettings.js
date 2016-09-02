"use strict";
const Datastore = require('nedb');
let serverSettings = new Datastore({ filename: './databases/serverSettings', autoload: true });

/**
 * Checks for a server's custom prefix. If there is none, default to "haru"
 * @arg {Object} msg - IMessage interface
 */
exports.checkForCustomPrefix = function (msg) {
	return new Promise ((resolve, reject) => {
		serverSettings.find({ _id: msg.guild.id }, (err, docs) => {
			if (err) {
				console.log(err);
				return resolve("haru;");
			}

			if (docs.length > 0) {
				if (docs[0].prefixEnabled && docs[0].prefix !== "") {
					return resolve(docs[0].prefix);
				} else {
					return resolve("haru;");
				}
			} else {
				return resolve("haru;");
			}
		});
	});
}

/**
 * Checks for the server's custom member greeting.
 * @arg {IGuild} guild - Guild interface
 */
exports.checkForGreeting = function (guild) {
	return new Promise ((resolve, reject) => {
		serverSettings.find({ _id: guild.id }, (err, docs) => {
			if (err) {
				console.log(err);
				return reject(err);
			}

			if (docs.length > 0) {
				if (docs[0].greetingEnabled && docs[0].greeting !== "") {
					return resolve(docs[0].greeting);
				} else if (docs[0].greetingEnabled) {
					return resolve("DEFAULT");
				} else {
					return reject();
				}
			} else {
				return reject();
			}
		});
	});
}

/**
 * Check for log status and channel
 * @arg {IGuild} guild - Guild interface
 */
exports.checkLogging = function (guild) {
	return new Promise ((resolve, reject) => {
		serverSettings.find({ _id: guild.id }, (err, docs) => {
			if (err) {
				console.log(err);
				return reject(err);
			}

			if (docs.length > 0) {
				if (docs[0].logEnabled && docs[0].logChannel !== "") {
					return resolve(docs[0].logChannel);
				} else {
					return resolve("DISABLED");
				}
			} else {
				return resolve("DISABLED");
			}
		});
	});
}


/**
 * Checks if colors are enabled
 * @arg {IGuild} guild - Guild interface
 */
exports.checkColors = function (guild) {
	return new Promise ((resolve, reject) => {
		serverSettings.find({ _id: guild.id }, (err, docs) => {
			if (err) {
				console.log(err);
				return reject(err);
			}

			if (docs.length > 0) {
				if (docs[0].colorsEnabled) {
					return resolve("ENABLED");
				} else {
					return resolve("DISABLED");
				}
			}
		});
	});
}

/**
 * Enables/disables custom colors
 * @arg {IGuild} guild - Guild interface
 * @arg {String} whatToDo - Either enable or disable
 */
exports.updateColors = function (guild, whatToDo) {
	return new Promise ((resolve, reject) => {
		let boolV = ((whatToDo === "enable") ? true : false);

		serverSettings.update({ _id: guild.id }, {
			$set: { colorsEnabled: boolV }
		}, function (err, docs) {
			if (err) {
				console.log(err);
				return reject(err);
			}
			if (docs) {
				return resolve('Ok');
			}
		});
	});
}

/**
 * Updates the status for a custom prefix on a server
 * @arg {IGuild} guild - Guild interface
 * @arg {String} whatToDo - Tells the function what to execute
 * @arg {String} newPrefix - New prefix to set
 */
exports.updatePrefix = function (guild, whatToDo, newPrefix) {
	return new Promise ((resolve, reject) => {
		if (whatToDo === "enable" || whatToDo === "disable") {
			let statusBool = ((whatToDo === "enable") ? true : false);

			serverSettings.update({ _id: guild.id }, {
				$set: { prefixEnabled: statusBool }
			}, function (err, docs) {
				if (err) {
					console.log(err);
					return reject(err);
				}
				if (docs) {
					return resolve('Ok');
				}
			});
		} else if (whatToDo === "set") {
			serverSettings.update({ _id: guild.id }, {
				$set: { prefixEnabled: true, prefix: newPrefix }
			}, function (err, docs) {
				if (err) {
					console.log(err);
					return reject(err);
				}
				if (docs) {
					return resolve('Ok');
				}
			});
		}
	});
}

/**
 * Updates the status of a custom greeting on a server
 * @arg {IGuild} guild - Guild interface (server)
 * @arg {String} whatToDo - String indicating the function what action to perform (set, enable, disable)
 * @arg {String} newGreeting - String with the new greeting
 */
exports.updateGreeting = function (guild, whatToDo, newGreeting) {
	return new Promise ((resolve, reject) => {
		if (whatToDo === "enable" || whatToDo === "disable") {
			let statusBool = ((whatToDo === "enable") ? true : false);

			serverSettings.update({ _id:guild.id }, {
				$set: { greetingEnabled: statusBool }
			}, function (err, docs) {
				if (err) {
					console.log(err);
					return reject(err);
				}
				if (docs) {
					return resolve('Ok');
				}
			});
		} else if (whatToDo === "set") {
			serverSettings.update({ _id: guild.id }, {
				$set: { greetingEnabled: true, greeting: newGreeting }
			}, function (err, docs) {
				if (err) {
					console.log(err);
					return reject(err);
				}
				if (docs) {
					return resolve('Ok');
				}
			});
		}
	});
}

/**
 * Updates the status of event logging on a server
 * @arg {IGuild} guild - Guild interface
 * @arg {String} whatToDo - String (set, enable, disable)
 * @arg {String} channelID - ID of the logging channel
 */
exports.updateLogging = function (guild, whatToDo, channelID) {
	return new Promise ((resolve, reject) => {
		if (whatToDo === "enable" || whatToDo === "disable") {
			let statusBool = ((whatToDo === "enable") ? true : false);

			serverSettings.update({ _id: guild.id }, {
				$set: { logEnabled: statusBool }
			}, function (err, docs) {
				if (err) {
					console.log(err);
					return reject(err);
				}
				if (docs) {
					return resolve('Ok');
				}
			});
		} else if (whatToDo === "set") {
			serverSettings.update({ _id: guild.id }, {
				$set: { logEnabled: true, logChannel: channelID }
			}, function (err, docs) {
				if (err) {
					console.log(err);
					return reject(err);
				}
				if (docs) {
					return resolve('Ok');
				}
			});
		}
	});
}

/**
 * Updates the ignored status of a channel
 * @arg {IGuild} guild - Guild interface
 * @arg {String} whatToDo - Either ignore or unignore
 * @arg {String} channelID - Selected channel's ID
 */
exports.updateChannelIgnore = function (guild, whatToDo, channelID) {
	return new Promise ((resolve, reject) => {
		if (whatToDo === "ignore") {
			serverSettings.update({ _id: guild.id }, {
				$push: { ignoredChannels: channelID }
			}, function (err, docs) {
				if (err) {
					console.log(err);
					return reject(err);
				}
				if (docs) {
					return resolve('Ok');
				}
			});
		} else if (whatToDo === "unignore") {
			serverSettings.update({ _id: guild.id}, {
				$pull: { ignoredChannels: channelID }
			}, function (err, docs) {
				if (err) {
					console.log(err);
					return reject(err);
				}
				if (docs) {
					return resolve('Ok');
				}
			});
		}
	});
}

/**
 * Updates the ignored status of a user (by ID)
 * @arg {IGuild} guild - Guild interface
 * @arg {String} whatToDo - Either ignore or unignore
 * @arg {String} userID - User to perform the action on (ID string)
 */
exports.updateUserIgnore = function (guild, whatToDo, userID) {
	return new Promise ((resolve, reject) => {
		if (whatToDo === "ignore") {
			serverSettings.update({ _id: guild.id }, {
				$push: { ignoredUsers: userID }
			}, function (err, docs) {
				if (err) {
					console.log(err);
					return reject(err);
				}
				if (docs) {
					return resolve('Ok');
				}
			});
		} else if (whatToDo === "unignore") {
			serverSettings.update({ _id: guild.id}, {
				$pull: { ignoredUsers: userID }
			}, function (err, docs) {
				if (err) {
					console.log(err);
					return reject(err);
				}
				if (docs) {
					return resolve('Ok');
				}
			});
		}
	});
}


/**
 * Initializes the serversettings database for a determined server.
 * @arg {IGuild} guild - Guild interface
 */
exports.initializeServerSettings = function (guild) {
	return new Promise ((resolve, reject) => {
		let doc = {
			_id: guild.id,
			prefixEnabled: false,
			prefix: "",
			greetingEnabled: false,
			greeting: "",
			logEnabled: false,
			logChannel: "",
			ignoredChannels: ["ID"],
			ignoredUsers: ["ID"],
			colorsEnabled: false
		}

		serverSettings.insert(doc, (err, newDoc) => {
			if (err) {
				console.log(err);
				return reject(err);
			}

			if (newDoc) {
				return resolve('Ok');
			}
		});
	});
}

/**
 * Deletes the database entry for a specific guild when it becomes unavailable or is deleted
 * @arg {String} guildID - ID of the unavailable guild
 */
exports.deleteServerSettings = function (guildID) {
	return new Promise ((resolve, reject) => {
		serverSettings.remove({ _id: guildID }, {}, function (err) {
			if (err) return reject(err);
			return resolve('Ok');
		});
	});
}
