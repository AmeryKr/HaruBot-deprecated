"use strict";
const Datastore = require('nedb');
const Auth = require("../../auth.json");
let permissions = new Datastore({ filename: './databases/permissions', autoload: true });

/**
 * Checks for a user's permission level to execute a command
 * @arg {IMessage} msg - Message interface
 * @arg {Object} user - User Object
 * @arg {Array<IRole>} roles - Array of role interfaces
 */
exports.checkPermissions = function (msg, user, roles) {
	return new Promise ((resolve, reject) => {
		if (Auth.botOwner.indexOf(user.id) > -1) {
			return resolve(42);
		}

		permissions.find({ _id: msg.guild.id }, (err, docs) => {
			if (err) {
				console.log(err);
				return reject(err);
			}

			if (docs.length > 0) {

				if (docs[0].superuser === user.id) {
					return resolve(4);
				}

				let level = 0;

				if (roles) {
					for (let r of roles) {
						if (docs[0].level1.indexOf(r.id) > -1) {
							level = (level > 1) ? level : (level !== -1) ? 1 : -1 /* Thanks, WildBot */
						} else if (docs[0].level2.indexOf(r.id) > -1) {
							level = (level > 1) ? level : (level !== -1) ? 2 : -1
						} else if (docs[0].level3.indexOf(r.id) > -1) {
							level = (level > 1) ? level : (level !== -1) ? 3 : -1
						} else if (docs[0].ignore.indexOf(r.id) > -1) {
							level = -1;
						}
					}
				}

				return resolve(level);
			} else {
				return resolve(0);
			}
		});
	});
}

/**
 * Updates permissions for a specific role
 * @arg {IGuild} guild - Guild interface
 * @arg {String} roleID - ID of the role to modify
 * @arg {String} level - Level in which to place the role, or "ignore"
 */
exports.updatePermissions = function (guild, roleID, level) {
	return new Promise ((resolve, reject) => {
		/* To save space, we pull the role ID from the permissions first */
		permissions.update({ _id: guild.id }, {
			$pull: {
				level1: roleID,
				level2: roleID,
				level3: roleID,
				ignore: roleID
			}
		}, function (err) {
			if (err) return reject(err);
		});

		/* And then we reintroduce */
		permissions.update({ _id: guild.id }, {
			$addToSet: { [level]: roleID }
		}, function (err) {
			if (err) return reject(err);
			else return resolve('Ok');
		});
	});
}

/**
 * Removes permission level of a specific role 
 * @arg {IGuild} guild - Guild interface
 * @arg {String} roleID - ID of the role to remove
 */
exports.removePermissions = function (guild, roleID) {
	return new Promise ((resolve, reject) => {
		permissions.update({ _id: guild.id }, {
			$pull: {
				level1: roleID,
				level2: roleID,
				level3: roleID,
				ignore: roleID
			}
		}, function (err) {
			if (err) return reject(err);
			else return resolve('Ok');
		});
	});
}

/**
 * Sets the desired mute role for a server
 * @arg {IGuild} guild - Guild interface
 * @arg {String} roleID - ID of the new Mute role
 */
exports.setMuteRole = function (guild, roleID) {
	return new Promise ((resolve, reject) => {
		permissions.update({ _id: guild.id }, {
			$set: { muteRole: roleID }
		}, function (err) {
			if (err) return reject(err);
			else return resolve('Ok');
		});
	});
}

/**
 * Removes the mute role for a server
 * @arg {IGuild} guild - Guild interface
 */
exports.removeMuteRole = function (guild) {
	return new Promise ((resolve, reject) => {
		permissions.update({ _id: guild.id }, {
			$set: { muteRole: "" }
		}, function (err) {
			if (err) return reject(err);
			else return resolve('Ok');
		});
	});
}

/**
 * Checks for a mute role
 * @arg {IGuild} guild - Guild interface
 */
exports.getMuteRole = function (guild) {
	return new Promise ((resolve, reject) => {
		permissions.findOne({ _id: guild.id }, function (err, doc) {
			if (err) return reject(err);
			if (doc && doc.muteRole !== "") {
				return resolve(doc.muteRole);
			} else {
				return reject("No Mute role specified! Set it with `setmute`.");
			}
		})
	});
}

/**
 * Blacklist a server
 * @arg {String} guildID - ID of the guild to Blacklist
 * @arg {String} whatToDo - Either "blacklist" or "remove"
 */
exports.blacklistServer = function (guildID, whatToDo) {
	return new Promise ((resolve, reject) => {
		let boolBlacklist = ((whatToDo === "blacklist") ? true : false);

		permissions.update({ _id: guildID }, {
			$set: { blacklisted: boolBlacklist }
		}, function (err) {
			if (err) return reject(err);
			else return resolve(whatToDo);
		});
	});
}

/**
 * Initializes a permissions database document for a server.
 * @arg {IGuild} guild - Guild interface
 */
exports.initializePermissions = function (guild) {
	return new Promise ((resolve, reject) => {
		let doc = {
			_id: guild.id,
			superuser: guild.owner.id,
			level1: ["1"],
			level2: ["2"],
			level3: ["3"],
			ignore: ["-1"],
			muteRole: "",
			blacklisted: false
		}

		permissions.insert(doc, (err, newDoc) => {
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