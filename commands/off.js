module.exports = {
	name: 'off',
	description: 'Turns off the bot',
	alias: [],
	async execute(message) {
		// if the user is not the developper
		if (!message.author.id == '250547618537537537') return ;

		// reboots
		await message.channel.send('Turning off');
		process.exit();
	},
};

