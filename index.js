const { Client, MessageActionRow, MessageButton, MessageEmbed } = require("discord.js");
const Database = require("@replit/database");
const db_repl = new Database();
const wait = require('node:timers/promises').setTimeout;
const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const colors = require("colors");
const db = require("quick.db");
const config = require("./config.json");
const express = require('express');
const app = express();

app.get('/', (req, res) => res.send('Hello World!'));

app.listen(3000, () => console.log(`Example app listening at http://localhost:3000`));

const client = new Client({
	intents: 32767
});

client.once('ready', async () => {
	console.log(`[CLIENT] ${client.user.tag} is up and ready to go!`.brightGreen);
	const statusArray = [`/help, PLAYING`, `${client.guilds.cache.size} servers, WATCHING`];
	setInterval(() => {
		const random = statusArray[Math.floor(Math.random() * statusArray.length)].split(', ');
		const status = random[0];
		const mode = random[1];
		client.user.setActivity(status, { type: mode });
	}, 5000);
});

// Prefix commands:
client.on('messageCreate', async (message) => {
	if (message.author.bot) return;
	if (message.content.indexOf(config.Prefix) !== 0) return;

	const args = message.content.slice(config.Prefix.length).trim().split(/ +/g);
	const command = args.shift().toLowerCase()

	if (command === "premium") {
		if (message.member.id !== config.Owner) return messaged.delete();
		if (!args[0]) return message.reply("Use: add/remove");

		if (args[0].toLowerCase() === "add") {
			if (!args[1]) return message.reply("Please provide the guild id.");

			const guild = client.guilds.cache.get(args[1]);

			if (!guild) return message.reply("Invalid guild id.");

			db.set(`premium_${guild.id}`, true);

			return message.reply(`**Done!** Added premium to **${guild.name}**.`)
		}

		if (args[0].toLowerCase() === "remove") {
			if (!args[1]) return message.reply("Please provide the guild id.");

			const guild = client.guilds.cache.get(args[1]);

			if (!guild) return message.reply("Invalid guild id.");

			db.delete(`premium_${guild.id}`);

			return message.reply(`**Done!** Removed premium to **${guild.name}**.`)
		}
	}
});

// Slash Commands - HANDLER:
const commands = [
	new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with pong!'),
	new SlashCommandBuilder()
		.setName('help')
		.setDescription('Replies with a help menu and a list of commands!'),
	new SlashCommandBuilder()
		.setName('roles')
		.setDescription('Get some roles!'),
	new SlashCommandBuilder()
		.setName('disable_system')
		.setDescription('Disable the system on this server!'),
	new SlashCommandBuilder()
		.setName('setup')
		.setDescription('Setup the system!')

		.addRoleOption(option =>
			option.setName('role_1')
				.setDescription('Provide a role (1) for the system. (Required)')
				.setRequired(true))
		.addStringOption(option =>
			option.setName('description_role_1')
				.setDescription('Set a description for the role 1.'))

		.addRoleOption(option =>
			option.setName('role_2')
				.setDescription('Provide a role (2) for the system.'))
		.addStringOption(option =>
			option.setName('description_role_2')
				.setDescription('Set a description for the role 2.'))

		.addRoleOption(option =>
			option.setName('role_3')
				.setDescription('Provide a role (3) for the system.'))
		.addStringOption(option =>
			option.setName('description_role_3')
				.setDescription('Set a description for the role 3.'))

		.addRoleOption(option =>
			option.setName('role_4')
				.setDescription('Provide a role (4) for the system.'))
		.addStringOption(option =>
			option.setName('description_role_4')
				.setDescription('Set a description for the role 4.'))

		.addRoleOption(option =>
			option.setName('role_5')
				.setDescription('Provide a role (5) for the system.'))
		.addStringOption(option =>
			option.setName('description_role_5')
				.setDescription('Set a description for the role 5.'))

		.addRoleOption(option =>
			option.setName('role_6')
				.setDescription('Provide a role (6) for the system. (PREMIUM ONLY)'))
		.addStringOption(option =>
			option.setName('description_role_6')
				.setDescription('Set a description for the role 6. (PREMIUM ONLY)'))

		.addRoleOption(option =>
			option.setName('role_7')
				.setDescription('Provide a role (7) for the system. (PREMIUM ONLY)'))
		.addStringOption(option =>
			option.setName('description_role_7')
				.setDescription('Set a description for the role 7. (PREMIUM ONLY)'))

		.addRoleOption(option =>
			option.setName('role_8')
				.setDescription('Provide a role (8) for the system. (PREMIUM ONLY)'))
		.addStringOption(option =>
			option.setName('description_role_8')
				.setDescription('Set a description for the role 8. (PREMIUM ONLY)'))

		.addRoleOption(option =>
			option.setName('role_9')
				.setDescription('Provide a role (9) for the system. (PREMIUM ONLY)'))
		.addStringOption(option =>
			option.setName('description_role_9')
				.setDescription('Set a description for the role 9. (PREMIUM ONLY)'))

		.addRoleOption(option =>
			option.setName('role_10')
				.setDescription('Provide a role (10) for the system. (PREMIUM ONLY)'))
		.addStringOption(option =>
			option.setName('description_role_10')
				.setDescription('Set a description for the role 10. (PREMIUM ONLY)')),
]
	.map(command => command.toJSON());

const authentification = process.env.TOKEN || config.Token;

const rest = new REST({ version: '9' }).setToken(authentification);

/*rest.put(Routes.applicationGuildCommands(config.Client_ID, config.Guild_ID), { body: commands })
	.then(() => console.log('[HANDLER] Successfully loaded all the slash commands!'.brightGreen))
	.catch(console.error);*/

rest.put(Routes.applicationCommands(config.Client_ID), { body: commands })
  .then(() => console.log('[HANDLER] Successfully loaded all the slash commands!'.brightGreen))
  .catch(console.error);

// Slash Commands - COMMANDS:
client.on('interactionCreate', async (interaction) => {
	if (!interaction.isCommand()) return;

	const { commandName } = interaction;

	const cmd = commandName;

	if (cmd === 'ping') {
		interaction.reply({ content: `🏓 **Pong!** Websocket ping: \`${client.ws.ping} ms\`.`, ephemera: true });
	};

	if (cmd === 'disable_system') {
		if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ content: `${config.Emojis.Wrong} **Only the users with the permission \`ADMINISTRATOR\` can use this command!**`, ephemeral: true });

		db.set(`boolean_${interaction.guild.id}`, false);

		db_repl.delete(`role_1_description_${interaction.guild.id}`);
		db_repl.delete(`role_2_description_${interaction.guild.id}`);
		db_repl.delete(`role_3_description_${interaction.guild.id}`);
		db_repl.delete(`role_4_description_${interaction.guild.id}`);
		db_repl.delete(`role_5_description_${interaction.guild.id}`);
		db_repl.delete(`role_6_description_${interaction.guild.id}`);
		db_repl.delete(`role_7_description_${interaction.guild.id}`);
		db_repl.delete(`role_8_description_${interaction.guild.id}`);
		db_repl.delete(`role_9_description_${interaction.guild.id}`);
		db_repl.delete(`role_10_description_${interaction.guild.id}`);

		db.delete(`role_1_${interaction.guild.id}`);
		db.delete(`role_2_${interaction.guild.id}`);
		db.delete(`role_3_${interaction.guild.id}`);
		db.delete(`role_4_${interaction.guild.id}`);
		db.delete(`role_5_${interaction.guild.id}`);
		db.delete(`role_6_${interaction.guild.id}`);
		db.delete(`role_7_${interaction.guild.id}`);
		db.delete(`role_8_${interaction.guild.id}`);
		db.delete(`role_9_${interaction.guild.id}`);
		db.delete(`role_10_${interaction.guild.id}`);

		interaction.reply({ content: `${config.Emojis.Done} **Done!** The system is now disabled.`, ephemeral: true });

	};

	if (cmd === 'help') {
		const embed = new MessageEmbed()
			.setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
			.setTitle("Help Menu!")
			.setThumbnail(client.user.displayAvatarURL())
			.setDescription(`**Welcome to ${client.user}'s service!** Here are the prefix commands and the slash commands:`)
			.addFields(
				{
					name: "TEST",
					value: "TEST"
				},
			)
			.setColor("GREEN");

		interaction.reply({ embeds: [embed], ephemeral: true });
	};

	if (cmd === 'setup') {

		if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ content: `${config.Emojis.Wrong} **Only the users with the permission \`ADMINISTRATOR\` can use this command!**`, ephemeral: true });

		const role_1 = interaction.options.getRole('role_1');
		const desc_role_1 = interaction.options.getString('description_role_1');

		const role_2 = interaction.options.getRole('role_2');
		const desc_role_2 = interaction.options.getString('description_role_2');

		const role_3 = interaction.options.getRole('role_3');
		const desc_role_3 = interaction.options.getString('description_role_3');

		const role_4 = interaction.options.getRole('role_4');
		const desc_role_4 = interaction.options.getString('description_role_4');

		const role_5 = interaction.options.getRole('role_5');
		const desc_role_5 = interaction.options.getString('description_role_5');

		const role_6 = interaction.options.getRole('role_6');
		const desc_role_6 = interaction.options.getString('description_role_6');

		const role_7 = interaction.options.getRole('role_7');
		const desc_role_7 = interaction.options.getString('description_role_7');

		const role_8 = interaction.options.getRole('role_8');
		const desc_role_8 = interaction.options.getString('description_role_8');

		const role_9 = interaction.options.getRole('role_9');
		const desc_role_9 = interaction.options.getString('description_role_9');

		const role_10 = interaction.options.getRole('role_10');
		const desc_role_10 = interaction.options.getString('description_role_10');

		db.set(`boolean_${interaction.guild.id}`, true);

		db.set(`role_1_${interaction.guild.id}`, role_1.id);
		if (desc_role_1) {
			db_repl.set(`role_1_description_${interaction.guild.id}`, desc_role_1);
		} else {
			db_repl.set(`role_1_description_${interaction.guild.id}`, "`No Description.`");
		}

		if (role_2) {
			db.set(`role_2_${interaction.guild.id}`, role_2.id);
			if (desc_role_2) {
				db_repl.set(`role_2_description_${interaction.guild.id}`, desc_role_2);
			} else {
				db_repl.set(`role_2_description_${interaction.guild.id}`, "`No Description.`");
			}
		}

		if (role_3) {
			db.set(`role_3_${interaction.guild.id}`, role_3.id);
			if (desc_role_3) {
				db_repl.set(`role_3_description_${interaction.guild.id}`, desc_role_3);
			} else {
				db_repl.set(`role_3_description_${interaction.guild.id}`, "`No Description.`");
			}
		}

		if (role_4) {
			db.set(`role_4_${interaction.guild.id}`, role_4.id);
			if (desc_role_4) {
				db_repl.set(`role_4_description_${interaction.guild.id}`, desc_role_4);
			} else {
				db_repl.set(`role_4_description_${interaction.guild.id}`, "`No Description.`");
			}
		}

		if (role_5) {
			db.set(`role_5_${interaction.guild.id}`, role_5.id);
			if (desc_role_5) {
				db_repl.set(`role_5_description_${interaction.guild.id}`, desc_role_5);
			} else {
				db_repl.set(`role_5_description_${interaction.guild.id}`, "`No Description.`");
			}
		}

		if (role_6) {
			db.set(`role_6_${interaction.guild.id}`, role_6.id);
			if (desc_role_6) {
				db_repl.set(`role_6_description_${interaction.guild.id}`, desc_role_6);
			} else {
				db_repl.set(`role_6_description_${interaction.guild.id}`, "`No Description.`");
			}
		}

		if (role_7) {
			db.set(`role_7_${interaction.guild.id}`, role_7.id);
			if (desc_role_7) {
				db_repl.set(`role_7_description_${interaction.guild.id}`, desc_role_7);
			} else {
				db_repl.set(`role_7_description_${interaction.guild.id}`, "`No Description.`");
			}
		}

		if (role_8) {
			db.set(`role_8_${interaction.guild.id}`, role_8.id);
			if (desc_role_8) {
				db_repl.set(`role_8_description_${interaction.guild.id}`, desc_role_8);
			} else {
				db_repl.set(`role_8_description_${interaction.guild.id}`, "`No Description.`");
			}
		}

		if (role_9) {
			db.set(`role_9_${interaction.guild.id}`, role_9.id);
			if (desc_role_9) {
				db_repl.set(`role_9_description_${interaction.guild.id}`, desc_role_9);
			} else {
				db_repl.set(`role_9_description_${interaction.guild.id}`, "`No Description.`");
			}
		}

		if (role_10) {
			db.set(`role_10_${interaction.guild.id}`, role_5.id);
			if (desc_role_10) {
				db_repl.set(`role_10_description_${interaction.guild.id}`, desc_role_10);
			} else {
				db_repl.set(`role_10_description_${interaction.guild.id}`, "`No Description.`");
			}
		}

		const embedWarn = new MessageEmbed()
			.setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
			.setTitle("Important note from the developers:")
			.addFields(
				{
					name: "• Roles position:",
					value: "> The roles that you set in the system must be **below** than my role, so I can give to the requested users their roles! [Fig. 1]"
				},
				{
					name: "• Bot permissions:",
					value: "> I need at least one of these permissions: `ADMINISTRATOR` / `MANAGE_ROLES`. [Fig. 2]"
				}
			)
			.setImage("https://media.discordapp.net/attachments/956636904923734016/981188653957124096/2022-05-31_15_29_06-general.png")
			.setFooter({ text: "For now, the system is 100% ready. Enjoy your day/night :]" })
			.setColor("YELLOW");

		interaction.reply({ content: `${config.Emojis.Done} **Done!** The system is now ready. Try the slash command \`/roles\`.`, embeds: [embedWarn], ephemeral: true });

		const row = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setURL('https://discord.gg/7zrFC2NPrd')
					.setLabel('Join support server!')
					.setStyle("LINK"),
				new MessageButton()
					.setURL('https://discord.com/api/oauth2/authorize?client_id=914104429211430912&permissions=8&scope=bot%20applications.commands')
					.setLabel('Invite me!')
					.setStyle("LINK"),
			)

		const embed = new MessageEmbed()
			.setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
			.setTitle("Get some roles by using buttons!")
			.setDescription(`To get the roles below, Please use the slash command \`/roles\`!`)
			.addFields(
				{
					name: "• 1️⃣ :",
					value: `${role_1 ? role_1 : "`No Roles.`"}`,
					inline: true
				},
				{
					name: "• 2️⃣ :",
					value: `${role_2 ? role_2 : "`No Roles.`"}`,
					inline: true
				},
				{
					name: "• 3️⃣ :",
					value: `${role_3 ? role_3 : "`No Roles.`"}`,
					inline: true
				},
				{
					name: "• 4️⃣ :",
					value: `${role_4 ? role_4 : "`No Roles.`"}`,
					inline: true
				},
				{
					name: "• 5️⃣ :",
					value: `${role_5 ? role_5 : "`No Roles.`"}`,
					inline: true
				},
				{
					name: "• 6️⃣ :",
					value: `${role_6 ? role_6 : "`No Roles.`"}`,
					inline: true
				},
				{
					name: "• 7️⃣ :",
					value: `${role_7 ? role_7 : "`No Roles.`"}`,
					inline: true
				},
				{
					name: "• 8️⃣ :",
					value: `${role_8 ? role_8 : "`No Roles.`"}`,
					inline: true
				},
				{
					name: "• 9️⃣ :",
					value: `${role_9 ? role_9 : "`No Roles.`"}`,
					inline: true
				},
				{
					name: "• 🔟 :",
					value: `${role_10 ? role_10 : "`No Roles.`"}`,
					inline: true
				},
			)
			.setFooter({ text: "Developed By: T.F.A#7524" })
			.setThumbnail(client.user.displayAvatarURL())
			.setColor("GREEN");

		interaction.channel.send({ embeds: [embed], components: [row] });


	}

	if (cmd === 'roles') {

		const bl = db.fetch(`boolean_${interaction.guild.id}`);
		const rr_check_if_disabled_or_not = db.fetch(`role_1_${interaction.guild.id}`);

		if (bl == false || rr_check_if_disabled_or_not === null) {
			const embedNoRole = new MessageEmbed()
				.setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
				.setDescription(`${config.Emojis.Wrong} The system is currently **disabled** or **not ready!**\nIf you have the permission \`ADMINISTRATOR\`, you can enable this command by using /setup.`)
				.setColor("RED");

			interaction.reply({ embeds: [embedNoRole], ephemeral: true });
		} else {

			const role_1 = db.fetch(`role_1_${interaction.guild.id}`);
			const desc_role_1 = await db_repl.get(`role_1_description_${interaction.guild.id}`);

			const role_2 = db.fetch(`role_2_${interaction.guild.id}`);
			const desc_role_2 = await db_repl.get(`role_2_description_${interaction.guild.id}`);

			const role_3 = db.fetch(`role_3_${interaction.guild.id}`);
			const desc_role_3 = await db_repl.get(`role_3_description_${interaction.guild.id}`);

			const role_4 = db.fetch(`role_4_${interaction.guild.id}`);
			const desc_role_4 = await db_repl.get(`role_4_description_${interaction.guild.id}`);

			const role_5 = db.fetch(`role_5_${interaction.guild.id}`);
			const desc_role_5 = await db_repl.get(`role_5_description_${interaction.guild.id}`);

			const role_6 = db.fetch(`role_6_${interaction.guild.id}`);
			const desc_role_6 = await db_repl.get(`role_5_description_${interaction.guild.id}`);

			const role_7 = db.fetch(`role_7_${interaction.guild.id}`);
			const desc_role_7 = await db_repl.get(`role_5_description_${interaction.guild.id}`);
			
			const role_8 = db.fetch(`role_8_${interaction.guild.id}`);
			const desc_role_8 = await db_repl.get(`role_5_description_${interaction.guild.id}`);
			
			const role_9 = db.fetch(`role_9_${interaction.guild.id}`);
			const desc_role_9 = await db_repl.get(`role_5_description_${interaction.guild.id}`);
			
			const role_10 = db.fetch(`role_10_${interaction.guild.id}`);
			const desc_role_10 = await db_repl.get(`role_5_description_${interaction.guild.id}`);

			const premium = db.fetch(`premium_${interaction.guild.id}`);

			const rr1 = interaction.guild.roles.cache.get(role_1);
			const rr2 = interaction.guild.roles.cache.get(role_2);
			const rr3 = interaction.guild.roles.cache.get(role_3);
			const rr4 = interaction.guild.roles.cache.get(role_4);
			const rr5 = interaction.guild.roles.cache.get(role_5);
			const rr6 = interaction.guild.roles.cache.get(role_6);
			const rr7 = interaction.guild.roles.cache.get(role_7);
			const rr8 = interaction.guild.roles.cache.get(role_8);
			const rr9 = interaction.guild.roles.cache.get(role_9);
			const rr10 = interaction.guild.roles.cache.get(role_10);

			const embed = new MessageEmbed()
				.setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
				.setTitle("Click on the buttons below to get the role!")
				.setDescription("Here's the numbers and their roles below:")
				.addFields(
					{
						name: "• 1️⃣ :",
						value: `> ${rr1 || "No Roles."}\n__Description:__ \n${desc_role_1 || "\`No Description.\`"}`,
						inline: true
					},
					{
						name: "• 2️⃣ :",
						value: `> ${rr2 || "No Roles."}\n__Description:__ \n${desc_role_2 || "\`No Description.\`"}`,
						inline: true
					},
					{
						name: "• 3️⃣ :",
						value: `> ${rr3 || "No Roles."}\n__Description:__ \n${desc_role_3 || "\`No Description.\`"}`,
						inline: true
					},
					{
						name: "• 4️⃣ :",
						value: `> ${rr4 || "No Roles."}\n__Description:__ \n${desc_role_4 || "\`No Description.\`"}`,
						inline: true
					},
					{
						name: "• 5️⃣ :",
						value: `> ${rr5 || "No Roles."}\n__Description:__ \n${desc_role_5 || "\`No Description.\`"}`,
						inline: true
					},
					{
						name: `• 6️⃣ : ${premium ? "** **" : "[PREMIUM ONLY]"}`,
						value: `> ${rr6 || "No Roles."}\n__Description:__ \n${desc_role_6 || "\`No Description.\`"}`,
						inline: true
					},
					{
						name: `• 7️⃣ : ${premium ? "** **" : "[PREMIUM ONLY]"}`,
						value: `> ${rr7 || "No Roles."}\n__Description:__ \n${desc_role_7 || "\`No Description.\`"}`,
						inline: true
					},
					{
						name: `• 8️⃣ : ${premium ? "** **" : "[PREMIUM ONLY]"}`,
						value: `> ${rr8 || "No Roles."}\n__Description:__ \n${desc_role_8 || "\`No Description.\`"}`,
						inline: true
					},
					{
						name: `• 9️⃣ : ${premium ? "** **" : "[PREMIUM ONLY]"}`,
						value: `> ${rr9 || "No Roles."}\n__Description:__ \n${desc_role_9 || "\`No Description.\`"}`,
						inline: true
					},
					{
						name: `• 🔟 : ${premium ? "** **" : "[PREMIUM ONLY]"}`,
						value: `> ${rr10 || "No Roles."}\n__Description:__ \n${desc_role_10 || "\`No Description.\`"}`,
						inline: true
					},
				)
				.setColor("GREEN");

			const row1 = new MessageActionRow()
				.addComponents(
					new MessageButton()
						.setCustomId('role1')
						.setLabel(' ')
						.setEmoji("1️⃣")
						.setDisabled(role_1 ? false : true)
						.setStyle(role_1 ? "SUCCESS" : "DANGER"),
					new MessageButton()
						.setCustomId('role2')
						.setLabel(' ')
						.setEmoji("2️⃣")
						.setDisabled(role_2 ? false : true)
						.setStyle(role_2 ? "SUCCESS" : "DANGER"),
					new MessageButton()
						.setCustomId('role3')
						.setLabel(' ')
						.setEmoji("3️⃣")
						.setDisabled(role_3 ? false : true)
						.setStyle(role_3 ? "SUCCESS" : "DANGER"),
					new MessageButton()
						.setCustomId('role4')
						.setLabel(' ')
						.setEmoji("4️⃣")
						.setDisabled(role_4 ? false : true)
						.setStyle(role_4 ? "SUCCESS" : "DANGER"),
					new MessageButton()
						.setCustomId('role5')
						.setLabel(' ')
						.setEmoji("5️⃣")
						.setDisabled(role_5 ? false : true)
						.setStyle(role_5 ? "SUCCESS" : "DANGER"),
				);

			const row2 = new MessageActionRow()
				.addComponents(
					new MessageButton()
						.setCustomId('role6')
						.setLabel(' ')
						.setEmoji("6️⃣")
						.setDisabled(role_6 ? false : true)
						.setStyle(role_6 ? "SUCCESS" : "DANGER"),
					new MessageButton()
						.setCustomId('role7')
						.setLabel(' ')
						.setEmoji("7️⃣")
						.setDisabled(role_7 ? false : true)
						.setStyle(role_7 ? "SUCCESS" : "DANGER"),
					new MessageButton()
						.setCustomId('role8')
						.setLabel(' ')
						.setEmoji("8️⃣")
						.setDisabled(role_8 ? false : true)
						.setStyle(role_8 ? "SUCCESS" : "DANGER"),
					new MessageButton()
						.setCustomId('role9')
						.setLabel(' ')
						.setEmoji("9️⃣")
						.setDisabled(role_9 ? false : true)
						.setStyle(role_9 ? "SUCCESS" : "DANGER"),
					new MessageButton()
						.setCustomId('role10')
						.setLabel(' ')
						.setEmoji("🔟")
						.setDisabled(role_10 ? false : true)
						.setStyle(role_10 ? "SUCCESS" : "DANGER"),
				);

			const row3 = new MessageActionRow()
				.addComponents(
					new MessageButton()
						.setCustomId('roles_premium_feature')
						.setLabel(premium ? "Premium is enabled." : "How to get premium?")
						.setEmoji("981173407045525524")
						.setDisabled(premium ? true : false)
						.setStyle(premium ? "SUCCESS" : "SECONDARY"),
				);

			interaction.reply({ embeds: [embed], components: [row1, row2, row3], ephemeral: true }).catch(() => { }).then(async (msg) => {

				const filter = i => i.user.id === interaction.member.id;

				const collector = interaction.channel.createMessageComponentCollector({
					filter: filter,
					componentType: "BUTTON"
				});

				collector.on("collect", async (col) => {

					const btn_id = col.customId;

					const user = col.member;

					// Role 1 button system:
					if (btn_id === "role1") {

						const r = db.fetch(`role_1_${interaction.guild.id}`);

						const embedNoRole = new MessageEmbed()
							.setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
							.setDescription(`${config.Emojis.Wrong} The button that you choosed (1) is **not ready yet!**`)
							.setColor("RED");

						if (r === null, !r) return col.reply({ embeds: [embedNoRole], ephemeral: true });

						const rr = interaction.guild.roles.cache.get(r)

						if (!user.roles.cache.has(rr.id)) {

							user.roles.add(rr)
								.catch(() => { })
								.then(() => {

									const embedAdd = new MessageEmbed()
										.setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
										.setDescription(`${config.Emojis.Done} I have **added** to role ${rr} to you!`)
										.setFooter("If you didn't got the role, please report this problem to the administrator(s) or the server owner(s)!")
										.setColor("GREEN");

									col.reply({ embeds: [embedAdd], ephemeral: true }).catch(() => { });

								});

						} else {

							user.roles.remove(rr)
								.catch(() => { })
								.then(() => {

									const embedRemove = new MessageEmbed()
										.setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
										.setDescription(`${config.Emojis.Done} I have **removed** to role ${rr} to you!`)
										.setFooter("If you still have the role, please report this problem to the administrator(s) or the server owner(s)!")
										.setColor("GREEN");

									col.reply({ embeds: [embedRemove], ephemeral: true }).catch(() => { });

								});

						}

					};

					// Role 2 button system:
					if (btn_id === "role2") {

						const r = db.fetch(`role_2_${interaction.guild.id}`);

						const embedNoRole = new MessageEmbed()
							.setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
							.setDescription(`${config.Emojis.Wrong} The button that you choosed (2) is **not ready yet!**`)
							.setColor("RED");

						if (r === null, !r) return col.reply({ embeds: [embedNoRole], ephemeral: true });

						const rr = interaction.guild.roles.cache.get(r)

						if (!user.roles.cache.has(rr.id)) {

							user.roles.add(rr)
								.catch(() => { })
								.then(() => {

									const embedAdd = new MessageEmbed()
										.setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
										.setDescription(`${config.Emojis.Done} I have **added** to role ${rr} to you!`)
										.setFooter("If you didn't got the role, please report this problem to the administrator(s) or the server owner(s)!")
										.setColor("GREEN");

									col.reply({ embeds: [embedAdd], ephemeral: true }).catch(() => { });

								});

						} else {

							user.roles.remove(rr)
								.catch(() => { })
								.then(() => {

									const embedRemove = new MessageEmbed()
										.setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
										.setDescription(`${config.Emojis.Done} I have **removed** to role ${rr} to you!`)
										.setFooter("If you still have the role, please report this problem to the administrator(s) or the server owner(s)!")
										.setColor("GREEN");

									col.reply({ embeds: [embedRemove], ephemeral: true }).catch(() => { });

								});

						}

					};

					// Role 3 button system:
					if (btn_id === "role3") {

						const r = db.fetch(`role_3_${interaction.guild.id}`);

						const embedNoRole = new MessageEmbed()
							.setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
							.setDescription(`${config.Emojis.Wrong} The button that you choosed (3) is **not ready yet!**`)
							.setColor("RED");

						if (r === null, !r) return col.reply({ embeds: [embedNoRole], ephemeral: true });

						const rr = interaction.guild.roles.cache.get(r)

						if (!user.roles.cache.has(rr.id)) {

							user.roles.add(rr)
								.catch(() => { })
								.then(() => {

									const embedAdd = new MessageEmbed()
										.setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
										.setDescription(`${config.Emojis.Done} I have **added** to role ${rr} to you!`)
										.setFooter("If you didn't got the role, please report this problem to the administrator(s) or the server owner(s)!")
										.setColor("GREEN");

									col.reply({ embeds: [embedAdd], ephemeral: true }).catch(() => { });

								});

						} else {

							user.roles.remove(rr)
								.catch(() => { })
								.then(() => {

									const embedRemove = new MessageEmbed()
										.setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
										.setDescription(`${config.Emojis.Done} I have **removed** to role ${rr} to you!`)
										.setFooter("If you still have the role, please report this problem to the administrator(s) or the server owner(s)!")
										.setColor("GREEN");

									col.reply({ embeds: [embedRemove], ephemeral: true }).catch(() => { });

								});

						}

					};

					// Role 4 button system:
					if (btn_id === "role4") {

						const r = db.fetch(`role_4_${interaction.guild.id}`);

						const embedNoRole = new MessageEmbed()
							.setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
							.setDescription(`${config.Emojis.Wrong} The button that you choosed (4) is **not ready yet!**`)
							.setColor("RED");

						if (r === null, !r) return col.reply({ embeds: [embedNoRole], ephemeral: true });

						const rr = interaction.guild.roles.cache.get(r)

						if (!user.roles.cache.has(rr.id)) {

							user.roles.add(rr)
								.catch(() => { })
								.then(() => {

									const embedAdd = new MessageEmbed()
										.setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
										.setDescription(`${config.Emojis.Done} I have **added** to role ${rr} to you!`)
										.setFooter("If you didn't got the role, please report this problem to the administrator(s) or the server owner(s)!")
										.setColor("GREEN");

									col.reply({ embeds: [embedAdd], ephemeral: true }).catch(() => { });

								});

						} else {

							user.roles.remove(rr)
								.catch(() => { })
								.then(() => {

									const embedRemove = new MessageEmbed()
										.setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
										.setDescription(`${config.Emojis.Done} I have **removed** to role ${rr} to you!`)
										.setFooter("If you still have the role, please report this problem to the administrator(s) or the server owner(s)!")
										.setColor("GREEN");

									col.reply({ embeds: [embedRemove], ephemeral: true }).catch(() => { });

								});

						}

					};

					// Role 5 button system:
					if (btn_id === "role5") {

						const r = db.fetch(`role_5_${interaction.guild.id}`);

						const embedNoRole = new MessageEmbed()
							.setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
							.setDescription(`${config.Emojis.Wrong} The button that you choosed (5) is **not ready yet!**`)
							.setColor("RED");

						if (r === null, !r) return col.reply({ embeds: [embedNoRole], ephemeral: true });

						const rr = interaction.guild.roles.cache.get(r)

						if (!user.roles.cache.has(rr.id)) {

							user.roles.add(rr)
								.catch(() => { })
								.then(() => {

									const embedAdd = new MessageEmbed()
										.setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
										.setDescription(`${config.Emojis.Done} I have **added** to role ${rr} to you!`)
										.setFooter("If you didn't got the role, please report this problem to the administrator(s) or the server owner(s)!")
										.setColor("GREEN");

									col.reply({ embeds: [embedAdd], ephemeral: true }).catch(() => { });

								});

						} else {

							user.roles.remove(rr)
								.catch(() => { })
								.then(() => {

									const embedRemove = new MessageEmbed()
										.setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
										.setDescription(`${config.Emojis.Done} I have **removed** to role ${rr} to you!`)
										.setFooter("If you still have the role, please report this problem to the administrator(s) or the server owner(s)!")
										.setColor("GREEN");

									col.reply({ embeds: [embedRemove], ephemeral: true }).catch(() => { });

								});

						}
					}

					// Role 6 button system:
					if (btn_id === "role6") {

						const r = db.fetch(`role_6_${interaction.guild.id}`);

						const embedNoRole = new MessageEmbed()
							.setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
							.setDescription(`${config.Emojis.Wrong} The button that you choosed (6) is **not ready yet!**`)
							.setColor("RED");

						if (r === null, !r) return col.reply({ embeds: [embedNoRole], ephemeral: true });

						const embedNoPremium = new MessageEmbed()
							.setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
							.setDescription(`${config.Emojis.Wrong} **This server doesn't have the premium version from me!**\nPlease click on the gray button about getting the premium feature from me.`)
							.setColor("RED");

						if (premium === null, !premium) return col.reply({ embeds: [embedNoPremium], ephemeral: true });

						const rr = interaction.guild.roles.cache.get(r)

						if (!user.roles.cache.has(rr.id)) {

							user.roles.add(rr)
								.catch(() => { })
								.then(() => {

									const embedAdd = new MessageEmbed()
										.setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
										.setDescription(`${config.Emojis.Done} I have **added** to role ${rr} to you!`)
										.setFooter("If you didn't got the role, please report this problem to the administrator(s) or the server owner(s)!")
										.setColor("GREEN");

									col.reply({ embeds: [embedAdd], ephemeral: true }).catch(() => { });

								});

						} else {

							user.roles.remove(rr)
								.catch(() => { })
								.then(() => {

									const embedRemove = new MessageEmbed()
										.setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
										.setDescription(`${config.Emojis.Done} I have **removed** to role ${rr} to you!`)
										.setFooter("If you still have the role, please report this problem to the administrator(s) or the server owner(s)!")
										.setColor("GREEN");

									col.reply({ embeds: [embedRemove], ephemeral: true }).catch(() => { });

								});

						}
					}

					// Role 7 button system:
					if (btn_id === "role7") {

						const r = db.fetch(`role_7_${interaction.guild.id}`);

						const embedNoRole = new MessageEmbed()
							.setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
							.setDescription(`${config.Emojis.Wrong} The button that you choosed (7) is **not ready yet!**`)
							.setColor("RED");

						if (r === null, !r) return col.reply({ embeds: [embedNoRole], ephemeral: true });

						const embedNoPremium = new MessageEmbed()
							.setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
							.setDescription(`${config.Emojis.Wrong} **This server doesn't have the premium version from me!**\nPlease click on the gray button about getting the premium feature from me.`)
							.setColor("RED");

						if (premium === null, !premium) return col.reply({ embeds: [embedNoPremium], ephemeral: true });

						const rr = interaction.guild.roles.cache.get(r)

						if (!user.roles.cache.has(rr.id)) {

							user.roles.add(rr)
								.catch(() => { })
								.then(() => {

									const embedAdd = new MessageEmbed()
										.setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
										.setDescription(`${config.Emojis.Done} I have **added** to role ${rr} to you!`)
										.setFooter("If you didn't got the role, please report this problem to the administrator(s) or the server owner(s)!")
										.setColor("GREEN");

									col.reply({ embeds: [embedAdd], ephemeral: true }).catch(() => { });

								});

						} else {

							user.roles.remove(rr)
								.catch(() => { })
								.then(() => {

									const embedRemove = new MessageEmbed()
										.setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
										.setDescription(`${config.Emojis.Done} I have **removed** to role ${rr} to you!`)
										.setFooter("If you still have the role, please report this problem to the administrator(s) or the server owner(s)!")
										.setColor("GREEN");

									col.reply({ embeds: [embedRemove], ephemeral: true }).catch(() => { });

								});

						}
					}

					// Role 8 button system:
					if (btn_id === "role8") {

						const r = db.fetch(`role_8_${interaction.guild.id}`);

						const embedNoRole = new MessageEmbed()
							.setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
							.setDescription(`${config.Emojis.Wrong} The button that you choosed (8) is **not ready yet!**`)
							.setColor("RED");

						if (r === null, !r) return col.reply({ embeds: [embedNoRole], ephemeral: true });

						const embedNoPremium = new MessageEmbed()
							.setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
							.setDescription(`${config.Emojis.Wrong} **This server doesn't have the premium version from me!**\nPlease click on the gray button about getting the premium feature from me.`)
							.setColor("RED");

						if (premium === null, !premium) return col.reply({ embeds: [embedNoPremium], ephemeral: true });

						const rr = interaction.guild.roles.cache.get(r)

						if (!user.roles.cache.has(rr.id)) {

							user.roles.add(rr)
								.catch(() => { })
								.then(() => {

									const embedAdd = new MessageEmbed()
										.setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
										.setDescription(`${config.Emojis.Done} I have **added** to role ${rr} to you!`)
										.setFooter("If you didn't got the role, please report this problem to the administrator(s) or the server owner(s)!")
										.setColor("GREEN");

									col.reply({ embeds: [embedAdd], ephemeral: true }).catch(() => { });

								});

						} else {

							user.roles.remove(rr)
								.catch(() => { })
								.then(() => {

									const embedRemove = new MessageEmbed()
										.setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
										.setDescription(`${config.Emojis.Done} I have **removed** to role ${rr} to you!`)
										.setFooter("If you still have the role, please report this problem to the administrator(s) or the server owner(s)!")
										.setColor("GREEN");

									col.reply({ embeds: [embedRemove], ephemeral: true }).catch(() => { });

								});

						}
					}

					// Role 9 button system:
					if (btn_id === "role9") {

						const r = db.fetch(`role_9_${interaction.guild.id}`);

						const embedNoRole = new MessageEmbed()
							.setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
							.setDescription(`${config.Emojis.Wrong} The button that you choosed (9) is **not ready yet!**`)
							.setColor("RED");

						if (r === null, !r) return col.reply({ embeds: [embedNoRole], ephemeral: true });

						const embedNoPremium = new MessageEmbed()
							.setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
							.setDescription(`${config.Emojis.Wrong} **This server doesn't have the premium version from me!**\nPlease click on the gray button about getting the premium feature from me.`)
							.setColor("RED");

						if (premium === null, !premium) return col.reply({ embeds: [embedNoPremium], ephemeral: true });

						const rr = interaction.guild.roles.cache.get(r)

						if (!user.roles.cache.has(rr.id)) {

							user.roles.add(rr)
								.catch(() => { })
								.then(() => {

									const embedAdd = new MessageEmbed()
										.setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
										.setDescription(`${config.Emojis.Done} I have **added** to role ${rr} to you!`)
										.setFooter("If you didn't got the role, please report this problem to the administrator(s) or the server owner(s)!")
										.setColor("GREEN");

									col.reply({ embeds: [embedAdd], ephemeral: true }).catch(() => { });

								});

						} else {

							user.roles.remove(rr)
								.catch(() => { })
								.then(() => {

									const embedRemove = new MessageEmbed()
										.setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
										.setDescription(`${config.Emojis.Done} I have **removed** to role ${rr} to you!`)
										.setFooter("If you still have the role, please report this problem to the administrator(s) or the server owner(s)!")
										.setColor("GREEN");

									col.reply({ embeds: [embedRemove], ephemeral: true }).catch(() => { });

								});

						}
					}

					// Role 10 button system:
					if (btn_id === "role10") {

						const r = db.fetch(`role_10_${interaction.guild.id}`);

						const embedNoRole = new MessageEmbed()
							.setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
							.setDescription(`${config.Emojis.Wrong} The button that you choosed (10) is **not ready yet!**`)
							.setColor("RED");

						if (r === null, !r) return col.reply({ embeds: [embedNoRole], ephemeral: true });

						const embedNoPremium = new MessageEmbed()
							.setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
							.setDescription(`${config.Emojis.Wrong} **This server doesn't have the premium version from me!**\nPlease click on the gray button about getting the premium feature from me.`)
							.setColor("RED");

						if (premium === null, !premium) return col.reply({ embeds: [embedNoPremium], ephemeral: true });

						const rr = interaction.guild.roles.cache.get(r)

						if (!user.roles.cache.has(rr.id)) {

							user.roles.add(rr)
								.catch(() => { })
								.then(() => {

									const embedAdd = new MessageEmbed()
										.setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
										.setDescription(`${config.Emojis.Done} I have **added** to role ${rr} to you!`)
										.setFooter("If you didn't got the role, please report this problem to the administrator(s) or the server owner(s)!")
										.setColor("GREEN");

									col.reply({ embeds: [embedAdd], ephemeral: true }).catch(() => { });

								});

						} else {

							user.roles.remove(rr)
								.catch(() => { })
								.then(() => {

									const embedRemove = new MessageEmbed()
										.setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
										.setDescription(`${config.Emojis.Done} I have **removed** to role ${rr} to you!`)
										.setFooter("If you still have the role, please report this problem to the administrator(s) or the server owner(s)!")
										.setColor("GREEN");

									col.reply({ embeds: [embedRemove], ephemeral: true }).catch(() => { });

								});

						}
					}

					// If premium feature:
					if(btn_id === "roles_premium_feature") {
						const embed = new MessageEmbed()
							.setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
							.setTitle("Premium feature:")
							.setDescription(`<:Premium:981173407045525524> Oh, so you want to get the premium feature from me? Yeah, we have some easy steps about getting this feature!`)
							.addFields(
								{
									name: "• How I get it?",
									value: "First of all, you need **Discord Nitro Regular** and some boosts. [Get nitro here.](https://discord.com/nitro)"
								},
								{
									name: "• Then what do I do with the nitro?",
									value: "Now, join the support server (Click on the button below). Boost the support server and DM the developers your server ID and tell them that you've boosted the server to let them giving to your server the premium feature!"
								},
								{
									name: "• What do I do if they didn't responded?",
									value: "Just be patient, they are probably busy or doing something else. You'll get 100% the premium feature if you've dmed them."
								},
								{
									name: "• What is gonna happen if my nitro expires?",
									value: "Nothing, your premium for your server will stay **forever on**. If you want to disable it, please DM the developers to disable it, and also by giving your server ID."
								},
							)
							.setFooter({ text: "We are following Discord ToS. Read: discord.com/terms" })
							.setColor("#f47fff");

						const row = new MessageActionRow()
							.addComponents(
								new MessageButton()
									.setURL('https://discord.gg/7zrFC2NPrd')
									.setLabel('Join the support server')
									.setStyle("LINK"),
							);

						col.reply({ embeds: [embed], components: [row], ephemeral: true }).catch(() => { });
					}

				});

			});
		}
	};

});

// Process errors Handler:
process.on('unhandledRejection', (reason, promis) => {
	console.log('\n[ERR] An error has been handled. :: unhandledRejection\n'.bold.red);
	console.log("[ERR] Reason: ".red + `${reason}`.underline.italic.yellow + "\n");
	console.log(promis)
});

process.on('uncaughtException', (err) => {
	console.log('\n[ERR] An error has been handled. :: uncaughtException\n'.bold.red);
	console.log("[ERR] Error: ".red + err + "\n");
});

// Login to the Bot:
if (!authentification) {
	console.log("[ERR] The bot token is not provided!".red);
} else {
	client.login(authentification)
		.catch((e) => {
			console.log("[ERR] The token is probably invalid, or the intents are currently disabled!".red);
			console.log("[ERR] Error from Discord API:".red + "\n" + e + "")
		});
};