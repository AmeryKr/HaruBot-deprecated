"use strict";
let commandsInModule = [];
let request = require('request');
let xml2js = require('xml2js');
let entities = require('entities');

const auth = require("../../auth.json");

commandsInModule.anime = {
	name: 'anime', module: 'Searches',
	help: 'Searches MyAnimeList for details on an anime.',
	usage: '[anime title]',
	cooldown: 30, levelReq: 0,
	exec: function (Client, msg, suffix) {
		if (!suffix) {
			msg.channel.sendMessage(":warning: No anime title!");
			return;
		}

		if (!auth.maluser || !auth.malpass || auth.maluser === "" || auth.malpass === "") {
			msg.channel.sendMessage(":warning: MAL Username and Password have not been setup.");
			return;
		}

		suffix = suffix.split(" ");
		suffix = suffix.join("+");

		var requestURL = `http://myanimelist.net/api/anime/search.xml?q=${suffix}`;

		request(requestURL, {"auth": {"user": auth.maluser, "pass": auth.malpass, "sendImmediately": false}}, function(error, response, body) {
			if (error) {
				console.log(error);
				msg.channel.sendMessage(":warning: There was an error while processing that request. Details:\n```xl\n" + error + "```");
			}

			if (response.statusCode === 200) {
				xml2js.parseString(body, function (err, result) {
					let title = result.anime.entry[0].title,
						english = result.anime.entry[0].english,
						episodes = result.anime.entry[0].episodes,
						score = result.anime.entry[0].score,
						type = result.anime.entry[0].type,
						status = result.anime.entry[0].status,
						summary = result.anime.entry[0].synopsis.toString(),
						image = result.anime.entry[0].image,
						id = result.anime.entry[0].id;

					summary = entities.decodeHTML(summary.replace(/<br \/>/g, "").replace(/\[(.{1,10})\]/g, " ")
														 .replace(/\r?\n|\r/g, " ").replace(/\[(i|\/i)\]/g, "*")
														 .replace(/\[(b|\/b)\]/g, "**"));

					if (summary.length > 300) {
						summary = summary.substring(0, 300) + "...";
					}

					if (english === "") {
						english = "--"
					}

					msg.channel.sendMessage("```ruby\n" +
					"     Title: \"" + title + " | " + english + "\"\n" +
					"      Type: \"" + type + "\"\n" +
					"    Status: \"" + status + "\"\n" +
					"  Episodes: " + episodes + "\n" +
					"Mean Score: " + score + "\n" +
					"   Summary: \'" + summary + "\'```\n" +
					"<http://www.myanimelist.net/anime/" + id + ">\n" + image);
				});
			} else {
				msg.channel.sendMessage(":warning: The anime `" + suffix.replace(/\+/g, " ") + "` was not found.");
			}
		});
	}
}

commandsInModule.manga = {
	name: 'manga', module: 'Searches',
	help: 'Searches MyAnimeList for details on a manga.',
	usage: '[manga title]',
	cooldown: 30, levelReq: 0,
	exec: function (Client, msg, suffix) {
		if (!suffix) {
			msg.channel.sendMessage(":warning: No manga title!");
			return;
		}

		if (!auth.maluser || !auth.malpass || auth.maluser === "" || auth.malpass === "") {
			msg.channel.sendMessage(":warning: MAL Username and Password have not been setup.");
			return;
		}

		suffix = suffix.split(" ");
		suffix = suffix.join("+");

		var requestURL = `http://myanimelist.net/api/manga/search.xml?q=${suffix}`;

		request(requestURL, {"auth": {"user": auth.maluser, "pass": auth.malpass, "sendImmediately": false}}, function(error, response, body) {
			if (error) {
				console.log(error);
				msg.channel.sendMessage(":warning: There was an error while processing that request. Details:\n```xl\n" + error + "```");
			}

			if (response.statusCode === 200) {
				xml2js.parseString(body, function (err, result) {
					let title = result.manga.entry[0].title,
						english = result.manga.entry[0].english,
						chapters = result.manga.entry[0].chapters,
						volumes = result.manga.entry[0].volumes,
						score = result.manga.entry[0].score,
						type = result.manga.entry[0].type,
						status = result.manga.entry[0].status,
						summary = result.manga.entry[0].synopsis.toString(),
						image = result.manga.entry[0].image,
						id = result.manga.entry[0].id;

					summary = entities.decodeHTML(summary.replace(/<br \/>/g, "").replace(/\[(.{1,10})\]/g, " ")
														 .replace(/\r?\n|\r/g, " ").replace(/\[(i|\/i)\]/g, "*")
														 .replace(/\[(b|\/b)\]/g, "**"));

					if (summary.length > 300) {
						summary = summary.substring(0, 300) + "...";
					}

					if (english === "") {
						english = "--"
					}

					msg.channel.sendMessage("```ruby\n" +
					"     Title: \"" + title + " | " + english + "\"\n" +
					"      Type: \"" + type + "\"\n" +
					"    Status: \"" + status + "\"\n" +
					"  Chapters: " + chapters + "\n" +
					"   Volumes: " + volumes + "\n" +
					"Mean Score: " + score + "\n" +
					"   Summary: \'" + summary + "\'```\n" +
					"<http://www.myanimelist.net/manga/" + id + ">\n" + image);
				});
			} else {
				msg.channel.sendMessage(":warning: The manga `" + suffix.replace(/\+/g, " ") + "` was not found.");
			}
		});
	}
}

exports.commandsInModule = commandsInModule;
