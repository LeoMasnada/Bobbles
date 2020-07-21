// Import the sequelize library
const Sequelize = require('sequelize');

module.exports = {
	name: 'tag',
	description: 'Adds a tag to the database or adds a token to an existing tag',
	async execute(message, args) {

		// Looks for the database file to load and log into
		const sequelize = new Sequelize('database', 'user', 'password', {
			host: 'localhost',
			dialect: 'sqlite',
			logging: false,
			// SQLite only
			storage: 'database.sqlite',
		});

		/*
		 * equivalent to: CREATE TABLE tags(
		 * name VARCHAR(255),
		 * description TEXT,
		 * username VARCHAR(255),
		 * usage INT
		 * );
		 */
		const Tags = sequelize.define('tags', {
			name: {
				type: Sequelize.STRING,
				unique: true,
			},
			description: Sequelize.TEXT,
			username: Sequelize.STRING,
			usage_count: {
				type: Sequelize.INTEGER,
				defaultValue: 0,
				allowNull: false,
			},
		});

		Tags.sync();


		const tagName = args.shift();
		const tagDesc = args.join(' ');

		try {
			const tag = await Tags.create({
				name: tagName,
				description: tagDesc,
				username: message.author.username,
			});
			return message.reply(`Tag ${tag.name} added.`);
		} catch (error) {
			if (error.name === 'SequelizeUniqueConstraintError') {
				return message.reply('That tag already exists.');
			}
			return message.reply('Something went wrong with adding a tag.');
		}
	},
};