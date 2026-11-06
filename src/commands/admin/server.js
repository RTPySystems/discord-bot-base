import { PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';
import { embed } from '../../lib/embed.js';

export default {
  data: new SlashCommandBuilder()
    .setName('server')
    .setDescription('Veja um resumo do servidor (gerenciar servidor).')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
  guildOnly: true,
  userPermissions: PermissionFlagsBits.ManageGuild,
  cooldownSeconds: 5,
  async execute(interaction) {
    await interaction.reply({
      embeds: [
        embed('Seu servidor', `**${interaction.guild.name}**`).addFields(
          { name: 'Membros', value: String(interaction.guild.memberCount), inline: true },
          { name: 'ID', value: interaction.guild.id, inline: true },
        ),
      ],
      allowedMentions: { parse: [] },
    });
  },
};
