/**	*****************************************/
//					Imports					//
/**	*****************************************/
// Import file reader library
const fs = require('fs');

// require the discord.js module
const Discord = require('discord.js');

// Import the token and prefix objects into variables
const {
	prefix,
	token,
} = require('./config/config.json');


/**	*****************************************/
//				Declarations				//
/**	*****************************************/
// create a new Discord client and gives it a collection of commands
const client = new Discord.Client();
client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();

/**	*****************************************/
//				Load command files			//
/**	*****************************************/
// Loads all commands located in the commands folder looking for files with a js extention
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

// Reads all the files found there and logs them as new command
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);

	// set a new item in the Collection
	// with the key as the command name and the value as the exported module
	client.commands.set(command.name, command);
	command.alias.forEach(a =>{
		client.aliases.set(a, command);
	});
	console.log('Loaded ' + command.name);
}

/**	*****************************************/
//				Load models					//
/**	*****************************************/
// Creates a 'table' with a user as key and an integer value associated to it
const Experience = require('./commands/models/Experience');
const BanWords = require('./commands/models/Banwords');


/**	*****************************************/
//					On Ready				//
/**	*****************************************/

// when the client is ready, run this code
// this event will only trigger one time after logging in
client.once('ready', () => {
	const str = new Date(Date.now()).toLocaleString('en-GB', { timeZone: 'Europe/Paris' });
	console.log(`${str} Bot is ready!`);
	// Loads the existing database or creates it if not existing
	Experience.sync();

});

/**	*****************************************/
//			On Message (commands)			//
/**	*****************************************/

// Whenever the bot catches a new message, this code runs
client.on('message', async message => {
	if (message.author.bot) return;

	// If the message doesn't start with the prefix, returns to skip treatment
	if (!message.content.startsWith(prefix)) return;

	// Splits the commands to separate each part into a cell using space as the split factor (will split any number of spaces as one end of word)
	const args = message.content.slice(prefix.length).split(/ +/);
	// Removes the 1st part of the args array and stores it as the command name, then shift it to lowercase
	const commandName = args.shift().toLowerCase();

	// If the command doesn't exist, and no alias exists with the command, replies that the command is unknown and skips the rest
	if (!client.commands.has(commandName)) {
		if(!client.aliases.has(commandName)) {
			return message.channel.send('This command doesn\'t exist');
		}
	}

	// Creates command holder
	let command;

	// Fetch the command file if it exists either in the commands or the alias collections
	if (client.commands.has(commandName)) {
		command = client.commands.get(commandName);
	}
	else {
		command = client.aliases.get(commandName);
	}

	// Attempts to run the command and logs any failure
	try {
		command.execute(message, args);
	}
	catch (error) {
		console.log(error);
		message.reply('there was an error while loading that command');
	}
});

/**	*****************************************/
//			On message (experience)			//
/**	*****************************************/

client.on('message', async message => {
	if (message.author.bot) return;

	// Looks if a user already has been given an experience value
	let user = await Experience.findOne({
		where: {
			user: message.author.id,
		},
	});
	// If the user that sent the last message hasn't any experience created, creates one
	if (!user) {
		try {
			user = await Experience.create({
				user: message.author.id,
				experience: 0,
			});
		}
		catch (error) {
			console.log('Error creating the new user\'s xp');
		}

	}
	// Adds 1 experience point to the user
	user.increment('experience');

	// Loads the custom reaction table model
	const CustomReactions = require('./commands/models/CustomReaction');

	// Fetch all reactions stored
	CustomReactions.findAll().then(
		cr => {
			// For each existing entry, tests if the trigger is included in the last seen message
			cr.forEach(customReact => {
				// If the message contains a trigger
				if (message.content.includes(customReact.trigger)) {
					// Sends out the reaction of the trigger
					message.channel.send(customReact.response);
				}
			});
		});

});

/**	*****************************************/
//			On message (Ban words)			//
/**	*****************************************/
client.on('message', async message =>{
	// Skip if sender was a bot
	if (message.author.bot) return;
	// Fetch all existing banwords
	const ban = await BanWords.findAll();

	// For each entry
	ban.forEach(word =>{
		// Creates a regular expression that isolates the current banword if it has no alpha-numerical symbol right before or after the word
		const reg = new RegExp(`(?<![\\w\\d])${word.word}(?![\\w\\d])`, 'i');

		// Tests if the word is included in the message
		if (message.content.match(reg)) {
			// Remove the message
			message.delete();
			// Warn the user
			message.channel.send('Do not use ' + word.word + ' again.').then(m=>m.delete({ timeout:3000 }));
		}
	});
});

/*
client.on('ready', () => {
});
*/

/**	*****************************************/
//					Login					//
/**	*****************************************/

// login to Discord with your app's token
client.login(token);