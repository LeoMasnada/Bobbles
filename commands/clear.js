module.exports = {
	name: 'clear',
	description: 'Removes X messages from the channel (not counting the command)',
	async execute(message, args) {

		// Removes the clear command message
		await message.delete();

		// Tests if the user has the right to remove messages, if not notifies them and removes the message after 5 seconds
		if (!message.member.hasPermission('MANAGE_MESSAGES')) {
			return message.reply('You don\'t have the required permission to do that').then(m => m.delete({ timeout:5000 }));
		}

		// If the command has been called with no arguments, asks the user to add one
		if (args.size <= 0) return message.reply('Please precise a number of messages to delete.').then(m => m.delete({ timeout:5000 }));

		// Reads the integer in the first argument, if no integer is read, asks a number to the user
		const amount = parseInt(args.shift());
		if (!amount) return message.reply('Please precise a number of messages to delete.').then(m => m.delete({ timeout:5000 }));

		// Deletes the requested amount of messages and notifies the user
		await message.channel.bulkDelete(amount).then(() => {
			message.channel.send(`Cleared ${amount} messages.`).then(m => m.delete({ timeout:5000 }));
		});
	},
};