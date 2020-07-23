const BanWords = require('./models/Banwords');
const Discord = require('discord.js');

module.exports = {
	name: 'banword',
	description: 'Manages the banwords',
	alias: ['bw'],
	async execute(message, args) {
		BanWords.sync();

		if (args[0] == 'add') {
			const exp = args.join(' ').match(/"(.*?)"/ig).shift().replace(/"/g, '');
			const bw = await BanWords.findOne({ where:{ word: exp } });
			if (!bw) {
				try{
					BanWords.create({
						word: exp,
					});
					message.channel.send('Successfully added the expression as a banword expression');
				}
				catch(error) {
					console.log('Error while creating new banword ' + error);
				}
			}
			else {
				message.reply('This expression already exists as a banword expression');
			}
		}
		else if (args[0] == 'remove') {
			const exp = args.join(' ').match(/"(.*?)"/ig).shift().replace(/"/g, '');
			const bw = BanWords.findOne({ where: { word: exp } });
			if (bw) {
				try {
					BanWords.destroy({ where:{
						word: exp,
					},
					});
					message.channel.send('Successfully removed the expression from the banword expression list');
				}
				catch (error) {
					console.log('Error while deletting banword ' + error);
				}
			}
			else {
				message.reply('This expression doesn\'t exists as a banword expression');
			}
		}
		// If user requests to see all banwords
		else if (args[0] == 'list') {
			// Creates a embed message and sets basic info
			const embed = new Discord.MessageEmbed()
				.setColor('#FF0000')
				.setTitle('List of existing banwords');

			// Fetch all banwords
			await BanWords.findAll().then(bw => {
				let str = '';
				bw.forEach(row => {
					str += row.word + ', ';
				});
				embed.addField('Banned expressions', str.substr(0, str.length - 2));
			});
			// Sends out the embed when completed
			message.channel.send(embed);
		}
		else {
			message.reply('Please precise a keyword \'add\' or \'remove\'');
		}
	},
};