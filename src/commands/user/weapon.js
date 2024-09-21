const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } = require('discord.js');
const path = require('node:path');
const weaponList = require('../../../hunt_api/api/weapon_list.json');
const weapons = require('../../../hunt_api/api/weapons.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('weapon')
		.setDescription('Search')
		.addStringOption(option =>
			option.setName('name')
				.setDescription('Weapon to look up.')
				.setRequired(true)
				.setAutocomplete(true)
		),
	async autocomplete(interaction) {
		const focusedValue = interaction.options.getFocused().toLowerCase();
		const filtered = weaponList.filter(choice => choice.toLowerCase().startsWith(focusedValue));
		await interaction.respond(
			filtered.map(choice => ({ name: choice, value: choice })),
		)
	},
	async execute(interaction) {
		const input = interaction.options.getString('name', true).toLowerCase();
		console.log('input:' + input);
		const weapon = weapons.find(array => array.name.toLowerCase() == input);
		const background_image = new AttachmentBuilder(path.join(__dirname, '../../../hunt_api/images/weapons_large/', weapon.background));
		const background_path = 'attachment://' + weapon.background;
		console.log(background_path);
		//build embed from user input
		const embed = new EmbedBuilder()
			.setColor('#8c0008')
			.setTitle(weapon.name)
			.setURL('https://huntshowdown.fandom.com/wiki/Berthier_Mle_1892#Berthier_Mle_1892')
			.setAuthor({ name: 'WEAPON', url: 'https://discord.js.org' })
			.setDescription(weapon.description)
			//.setThumbnail('https://i.imgur.com/AfFp7pu.png')
			.addFields(
				{ name: 'COST:', value: `\`${weapon.cost}\`` },
				//{ name: '\u200B', value: '\u200B' },
				{ name: 'DAMAGE:', value: `\`${weapon.damage}\``, inline: true },
				{ name: 'CAPACITY:', value: `\`${weapon.capacity}\``, inline: true },
				{ name: 'DROP RANGE:', value: `\`${weapon.drop_range}\``, inline: true },
				{ name: 'RATE OF RATE:', value: `\`${weapon.rate}\``, inline: true },
				{ name: 'CYCLE TIME:', value: `\`${weapon.cycle_time}\``, inline: true },
				{ name: 'VERTICAL RECOIL:', value: `\`${weapon.vertical_recoil}\``, inline: true },
				{ name: 'SPREAD:', value: `\`${weapon.spread}\``, inline: true },
				{ name: 'SWAY:', value: `\`${weapon.sway}\``, inline: true },
				{ name: 'RELOAD SPEED:', value: `\`${weapon.reload_speed}\``, inline: true },
				{ name: 'MUZZLE VELOCITY:', value: `\`${weapon.muzzle_velocity}\``, inline: true },
				{ name: 'MELEE DAMAGE:', value: `\`${weapon.melee_dmg}\``, inline: true },
				{ name: 'HEAVY MELEE DAMAGE:', value: `\`${weapon.heavy_melee_dmg}\``, inline: true },
				{ name: 'STAMINA CONSUMPTION:', value: `\`${weapon.stamina}\``, inline: true },
				{ name: 'AMMUNITION TYPE:', value: `\`${weapon.ammo_type}\``, inline: true },
				{ name: 'MELEE DAMAGE TYPE', value: `\`${weapon.melee_type}\``, inline: true },
				{ name: 'AMMO OPTIONS:', value: `\`${weapon.ammo_options}\``, inline: false }
			)
			.setImage('https://i.imgur.com/Y3q9H2r.png')
		//.setTimestamp()
		//.setFooter({ text: 'Some footer text here', iconURL: 'https://i.imgur.com/AfFp7pu.png' });
		await interaction.reply({ embeds: [embed], files: [background_image] });
	}
};