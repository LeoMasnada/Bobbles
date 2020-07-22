// Imports the model for the custom reaction table
const CustomReaction = require('./models/CustomReaction');

module.exports = {
	name: 'customreaction',
	description: '',
	async execute(message, args) {
		// Loads or creates the table of custom reaction table
		CustomReaction.sync();

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
				await CustomReaction.create({
					trigger: trigger,
					response: response,
				});
			}
			catch (error) {
				console.log('Error creating the new custom reaction');
			}
		}
	},
};