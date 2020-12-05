module.exports = {
	name: 'roll',
	description: 'Jet de dés',
	alias: ['r'],
	async execute(message, args) {

		// Checks validity of the command
		if (!args[0]) return message.reply('Please use the XdY format to roll dice');
		// Initializes the number and type of dice from the command called
		const x = parseInt(args[0].split('d')[0]);
		const y = parseInt(args[0].split('d')[1]);

		// If x and y are valid numbers
		if (x && y) {
			// Sends confirmation message
			message.channel.send(`Rolling ${x}d${y}...`)
			// Then logs all the dices thrown and each value resulting
				.then(() =>{
					// Init of storage values
					const results = new Array();
					let total = 0;
					// For each die log its value in number and string form
					for (let i = 0; i < x; i++) {
						const nb = Math.round(Math.random() * y);
						results.push(nb);
						total += nb;
					}
					// Init final message string
					let str = '';
					// For each die, add to the string its value
					for (let i = 0; i < results.length - 1; i++) {
						str += results[i] + '+';
					}
					str += results[results.length - 1];
					// Sends out result
					message.channel.send('Results: ' + str + '\nTotal: ' + total);
				});
		}
		// If x or y was invalid, abort
		else{
			message.reply('Please use the XdY format to roll dice');
		}
	},
};