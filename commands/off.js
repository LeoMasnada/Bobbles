module.exports.run = async (bot, message) => {
	// if the user is not the developper
	if (!message.author.id == '250547618537537537') return ;

	// reboots
	await message.channel.send('Turning off');
	process.exit();
};

module.exports.help = {
	name: 'off',
	description: 'Stops the bot. Only available for bot owner',
};