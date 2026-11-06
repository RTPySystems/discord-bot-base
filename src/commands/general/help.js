import { SlashCommandBuilder } from 'discord.js';
import { embed } from '../../lib/embed.js';

export default {
  data: new SlashCommandBuilder().setName('help').setDescription('Veja os comandos disponíveis.'),
  async execute(interaction, { commands }) {
    const list = [...commands.values()]
      .filter(
        (command) =>
          !command.userPermissions || interaction.memberPermissions?.has(command.userPermissions),
      )
      .map((command) => `**/${command.data.name}** — ${command.data.description}`)
      .join('\n');
    await interaction.reply({ embeds: [embed('Central de comandos', list)] });
  },
};
