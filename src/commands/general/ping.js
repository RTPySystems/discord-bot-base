import { SlashCommandBuilder } from 'discord.js';
import { embed } from '../../lib/embed.js';

export default {
  data: new SlashCommandBuilder().setName('ping').setDescription('Confira a conexão do bot.'),
  cooldownSeconds: 3,
  async execute(interaction) {
    await interaction.reply({
      embeds: [
        embed('Pong!', `Latência do gateway: **${Math.max(0, interaction.client.ws.ping)} ms**.`),
      ],
    });
  },
};
