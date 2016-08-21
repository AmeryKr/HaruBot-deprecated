"use strict";
process.title = "HaruBot v" + require('./package.json').version;

const Discordie = require("discordie");
const authToken = require("./auth.json").token;

/**
 * Helpers
 */
const logHelper = require("./helpers/log.js");
const messageHelper = require("./helpers/message.js");

/* Events constant */
const Events = Discordie.Events;

/* Create Client */
let Client = new Discordie({
	autoReconnect: true,
	delay: 1000
});

/* Connect */
Client.connect({ token: authToken });

Client.Dispatcher.on(Events.GATEWAY_READY, e => {
	Client.User.setGame("fishing...");
	logHelper.connection(Client, Client.Guilds.length, Client.Users.length, Client.Channels.length);
});

Client.Dispatcher.on(Events.MESSAGE_CREATE, e => {
	messageHelper.messageHelper(Client, e.message);
});