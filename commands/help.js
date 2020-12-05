const Discord = require('discord.js');
const client = require('./../index.js');

module.exports = {
	name: 'help',
	description: '',
	alias: ['h'],
	async execute(message, args) {
		const help = new Discord.MessageEmbed().setDescription('<> = Needed\n() = Optional');
		client.data.commands.forEach(command => {
			if (command['name'] != 'help') {
				help.addField('__**' + command.name + '**__', `${command.description}`);
			}
		});
		message.author.send(help);
	},
};