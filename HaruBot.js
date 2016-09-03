"use strict";
process.title = "HaruBot v" + require('./package.json').version;

const Discordie = require("discordie");
const authToken = require("./auth.json").token;

/**
 * Helpers
 */
const logHelper = require("./helpers/log.js");
const messageHelper = require("./helpers/message.js");
const guildEventsHelper = require("./helpers/guildevents.js");

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

/**
 * Guild Events
 */

Client.Dispatcher.on(Events.GUILD_CREATE, e => {
	guildEventsHelper.handleGuildCreateEvent(e.guild, e.becameAvailable);
});

Client.Dispatcher.on(Events.GUILD_DELETE, e => {
	guildEventsHelper.handleGuildDeleteEvent(e.guildId);
});

Client.Dispatcher.on(Events.GUILD_UNAVAILABLE, e => {
	guildEventsHelper.handleGuildDeleteEvent(e.guildId);
});

Client.Dispatcher.on(Events.GUILD_MEMBER_ADD, e => {
	guildEventsHelper.handleNewMember(e.guild, e.member);
});

Client.Dispatcher.on(Events.GUILD_MEMBER_REMOVE, e => {
	guildEventsHelper.handleMemberRemove(e.guild, e.user);
});

Client.Dispatcher.on(Events.GUILD_MEMBER_UPDATE, e => {
	guildEventsHelper.handleMemberUpdate(e.guild, e.member, e.rolesAdded, e.rolesRemoved, e.previousNick);
});

Client.Dispatcher.on(Events.GUILD_BAN_ADD, e => {
	guildEventsHelper.handleBan(e.guild, e.user);
});

Client.Dispatcher.on(Events.GUILD_BAN_REMOVE, e => {
	guildEventsHelper.handleUnban(e.guild, e.user);
});

/**
 * Update server count on Abal's website
 */
if (auth.abalToken) {
	setInterval(() => {
		eventsHelper.updateServerCount(Client.User.id, Client.Guilds.length, auth.abalToken);
	}, 2000000);
}
