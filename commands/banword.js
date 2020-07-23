// Import the banword table model
const BanWords = require('./models/Banwords');
// Import discord.js library
const Discord = require('discord.js');

module.exports = {
	name: 'banword',
	description: 'Manages the banwords',
	alias: ['bw'],
	async execute(message, args) {
		// Load or create the table in the database
		BanWords.sync();

		// If the user requests to add a new banword
		if (args[0] == 'add') {
			// Isolates the word to add from the double quotes
			let exp = args.join(' ').match(/"(.*?)"/ig);
			// If nothing has been isolated, notifies the user and aborts
			if (!exp) return message.reply('Please precise an expression to ban between " (double quotes)');
			// If something has been isolated, removes the quotes and saves
			else exp = exp.shift().replace(/"/g, '');
			// Try to fetch an existing banword with the requested one
			const bw = await BanWords.findOne({ where:{ word: exp } });
			// If none has been found
			if (!bw) {
				try{
					// Attempts to create the new entry
					BanWords.create({
						word: exp,
					});
					// Notifies the user on success
					message.channel.send('Successfully added the expression as a banword expression');
				}
				catch(error) {
					// Notifies on error
					console.log('Error while creating new banword ' + error);
				}
			}
			// If the banword already existed
			else {
				// Notifies the user on failure
				message.reply('This expression already exists as a banword expression');
			}
		}
		else if (args[0] == 'remove') {
			let exp = args.join(' ').match(/"(.*?)"/ig);
			if (!exp) return message.reply('Please precise an expression to ban between " (double quotes)');
			else exp = exp.shift().replace(/"/g, '');
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