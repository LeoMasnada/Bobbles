// Imports the model for the custom reaction table
const CustomReaction = require('./models/CustomReaction');
const Discord = require('discord.js');

module.exports = {
	name: 'customreaction',
	description: '',
	alias: ['cr'],
	async execute(message, args) {
		// Loads or creates the table of custom reaction table
		CustomReaction.sync();

		// If user requests to add a reaction trigger
		if (args[0] == 'add') {

			// Extracts the first part of the arguments between quotes
			const trigger = args.join(' ').split('"')[1];
			// Extracts the second part of the arguments between quotes
			const response = args.join(' ').split('"')[3];

			// If not at least 2 parts were put between quotes, aborts and notifies the user
			if (!trigger || !response) return message.reply('Please precise a trigger and a response between " (double quotes)');

			// If two parts were found, look for an existing identical trigger
			const cr = await CustomReaction.findOne({
				where: {
					trigger: trigger,
				},
			});
			// If none were found, adds the requested to the database
			if (!cr) {
				try {
					// Creates new entry
					await CustomReaction.create({
						trigger: trigger,
						response: response,
					});
					// Feedback on success
					message.channel.send('Successfully created the reaction');
				}
				catch (error) {
					// Feedback on error
					console.log('Error creating the new custom reaction');
				}
			}
		}
		// If user requests to remove a reaction
		else if (args[0] == 'remove') {
			// Extracts the first part of the arguments between quotes
			const trigger = args.join(' ').split('"')[1];

			// If no trigger was specified, notifies user
			if (!trigger) return message.reply('Please precise a trigger between " (double quotes)');
			try{
				// Removes the requested reaction
				await CustomReaction.destroy({
					where: {
						trigger: trigger,
					},
				});

				// Notifies user on success
				message.channel.send('Successfully removed the reaction');
			}
			catch(error) {
				// Logs if error
				console.log('Error deleting the reaction ' + error);
			}
		}
		// If user requests to see all reactions
		else if (args[0] == 'list') {
			// Creates a embed message and sets basic info
			const embed = new Discord.MessageEmbed()
				.setColor('#FF0000')
				.setTitle('List of existing reactions');

			// Fetch all reactions
			await CustomReaction.findAll().then(cr => {
				// For each reaction
				cr.forEach(triggerReaction => {
					// Adds a field with the reaction and response
					embed.addField('Trigger: ' + triggerReaction.trigger, 'Response: ' + triggerReaction.response);
				});
			});
			// Sends out the embed when completed
			message.channel.send(embed);
		}
		// If no action was specified, requests the user to do so
		else {
			message.reply('Please precise \'add\', \'remove\', or \'list\' after the command');
		}
	},
};