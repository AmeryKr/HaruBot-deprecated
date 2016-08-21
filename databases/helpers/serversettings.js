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