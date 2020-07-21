// Import file reader library
const fs = require('fs');

// Import the sequelize library
const Sequelize = require('sequelize');

// require the discord.js module
const Discord = require('discord.js');

// Import the token and prefix objects into variables
const {
	prefix,
	token,
} = require('./config/config.json');

// create a new Discord client and gives it a collection of commands
const client = new Discord.Client();
client.commands = new Discord.Collection();

// Loads all commands located in the commands folder looking for files with a js extention
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

// Reads all the files found there and logs them as new command
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);

	// set a new item in the Collection
	// with the key as the command name and the value as the exported module
	client.commands.set(command.name, command);
}

// Looks for the database file to load and log into
const sequelize = new Sequelize('database', 'user', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	// SQLite only
	storage: 'database.sqlite',
});

// Creates a 'table' with a user as key and an integer value associated to it
const Experience = sequelize.define('xp', {
	user: {
		type: Sequelize.STRING,
		unique: true,
	},
	experience: {
		type: Sequelize.INTEGER,
		defaultValue: 0,
		allowNull: false,
	},

});


// when the client is ready, run this code
// this event will only trigger one time after logging in
client.once('ready', () => {
	console.log('Ready!');
	// Loads the existing database or creates it if not existing
	Experience.sync();
});

// login to Discord with your app's token
client.login(token);

// Whenever the bot catches a new message, this code runs
client.on('message', async message => {
	// If the message doesn't start with the prefix, returns to skip treatment
	if (!message.content.startsWith(prefix)) return;

	// Splits the commands to separate each part into a cell using space as the split factor (will split any number of spaces as one end of word)
	const args = message.content.slice(prefix.length).split(/ +/);
	// Removes the 1st part of the args array and stores it as the command name, then shift it to lowercase
	const commandName = args.shift().toLowerCase();

	// If the command doesn't exist, replies that the command is unknown and skips the rest
	if (!client.commands.has(commandName)) return message.channel.send('This command doesn\'t exist');

	// Fetch the command file if it exists
	const command = client.commands.get(commandName);

	// Attempts to run the command and logs any failure
	try {
		command.execute(message, args);
	}
	catch (error) {
		console.log(error);
		message.reply('there was an error while loading that command');
	}

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
});