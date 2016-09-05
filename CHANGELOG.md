# HaruBot - Changelog

### v0.5.0 - Wh- How?!
* Implementing new versioning for the bot, now it's a little more organized
* Added a moderation command: search
* Fixed wrong level requirement on kick and ban commands (was 3, should've been 2)
* Fixed cooldown not resetting if color command is disabled
* Love

---

#### v0.4.7
* Fixed missing "events.js" require on main file
* Added a 10 second starting cooldown to bot list update

#### v0.4.6
* Fixed typo on POST data for bot list update

#### v0.4.5
* Changed bot list update interval from 33.33 minutes to 30 minutes

#### v0.4.4
* Fixed missing "auth.json" require on main file

#### v0.4.3
* The bot now sends how many servers it's in to bots.discord.pw

#### v0.4.2
* Added cooldown resets for wrong usage of the color command
* Fixed color command not removing previous color role

#### v0.4.1
* Fixed success message on color command

### v0.4.0 - Much colors, such colorful!
* Added a fun command: color (allows for custom self-assigned color roles)
* Added a server settings command: setcolors (allows for enabling/disabling of custom colors)
* Added two moderation commands: kick and ban
* Love

---

#### v0.3.1
* Fixed discordie version on package.json

### v0.3.0 - The weeb update!
* Added two fun commands: russianroulette and roll
* Added two searches commands: anime and manga (WEATHER WHEN?!)
* Fixed game name not being between quotation marks on userinfo
* Fixed help message being too long, so the bot now sends two!
* Fixed double message sent when a non-owner tried to use an owner only command
* Love

---

### v0.2.0 - We've become quite eventful!
* Added support for logging certain guild events on a channel set by the user
* Added greeting for new guild members (really? 2 updates later?!)
* If the bot gets kicked or a guild gets deleted, the bot will now delete its database entry
* Fixed success message from log update
* Love

---

### v0.1.0 - More fun things to come!
* Corrected bot response time on ping command
* Corrected bot uptime on info command
* Added more information to serverinfo command
* Added more information to userinfo command
* Added two fun commands: pat and ud (urban dictionary)
* Added logging of help requests
* Reformatted serverinfo's message
* Fixed typo on eval command (Client vs client, whoops!)
* Fixed lack of "use strict" on Moderation.js
* Love

---

### v0.0.0 - Quite some stuf, yo!
* Finished the base for the bot (connect with token/ready event/message event/basic db)
* Basic command functionality: ping, info, serverinfo, userinfo, prune, clean, setmute, mute, level, prefix, greeting, log, ignore
* Love
