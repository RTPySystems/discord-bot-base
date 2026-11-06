import { MessageFlags, PermissionFlagsBits } from 'discord.js';
import { WindowLimiter } from '../lib/window-limiter.js';

export function createInteractionHandler({ commands, logger }) {
  const cooldowns = new Map();
  return async (interaction) => {
    if (!interaction.isChatInputCommand()) return;
    const command = commands.get(interaction.commandName);
    const reply = (content) => interaction.reply({ content, flags: MessageFlags.Ephemeral });
    if (!command) return reply('Este comando não está disponível. Atualize a lista de comandos.');
    try {
      if (command.guildOnly && !interaction.inGuild()) {
        return await reply('Este comando só funciona dentro de um servidor.');
      }
      if (
        command.userPermissions &&
        (!interaction.memberPermissions ||
          !interaction.memberPermissions.has(command.userPermissions))
      ) {
        return await reply('Você não tem permissão para usar este comando.');
      }
      const botPermissions = command.botPermissions ?? PermissionFlagsBits.EmbedLinks;
      if (
        interaction.inGuild() &&
        (!interaction.appPermissions || !interaction.appPermissions.has(botPermissions))
      ) {
        return await reply(
          'Preciso da permissão de enviar mensagens e incorporar links neste canal.',
        );
      }
      if (!cooldowns.has(command.data.name)) {
        cooldowns.set(
          command.data.name,
          new WindowLimiter({ limit: 1, windowMs: (command.cooldownSeconds ?? 3) * 1000 }),
        );
      }
      const result = cooldowns.get(command.data.name).take(interaction.user.id);
      if (!result.allowed) {
        return await reply(`Aguarde ${Math.ceil(result.retryAfterMs / 1000)}s antes de repetir.`);
      }
      await command.execute(interaction, { commands });
    } catch (err) {
      logger.error({ err, command: interaction.commandName }, 'Falha ao executar comando.');
      const payload = {
        content: 'Não consegui concluir agora. Tente novamente em instantes.',
        flags: MessageFlags.Ephemeral,
      };
      try {
        if (interaction.deferred || interaction.replied) await interaction.followUp(payload);
        else await interaction.reply(payload);
      } catch (replyError) {
        logger.warn({ err: replyError }, 'A interação não aceita mais respostas.');
      }
    }
  };
}
