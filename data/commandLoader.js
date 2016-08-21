"use strict";
let directory = require('require-directory');
let cmds      = directory(module, './commands/');
let commands  = [];
let counter   = 0;
let chalk = require('chalk');

for (let f in cmds) {
  for (let o in cmds[f].commandsInModule) {
    commands[o] = cmds[f].commandsInModule[o];
    counter++;
  }
}

console.log(chalk.green("Successfully constructed ") + counter + chalk.green(" commands."));

exports.commands = commands;
