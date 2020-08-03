// Imports the Autorole table model
const ReactionRoles = require('./models/ReactionRoles');

module.exports = {
	name: 'reactionrole',
	description: '',
	alias: ['rr'],
	async execute(message, args) {
		ReactionRoles.sync();

		if(args[0] == 'add') {
			const emoji = message.guild.emojis.cache.get(args[1].match(/:([0-9]*?)>/ig).shift().replace(/[:->]/g, ''));
			if (!emoji) return message.reply('Please precise an emoji that I can use as first argument.');


			const rr = await ReactionRoles.findOne({
				where: {
					Reaction: emoji.id,
				},
			});

			if (rr) return message.reply('This emoji is already in use');
		}
		else if (args[0] == 'remove') {
			console.log('lol');
		}
		else{
			message.channel.send('Please precise your interaction with \'add\' or \'remove\'.');
		}
	},
};