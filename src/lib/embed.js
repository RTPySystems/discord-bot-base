import { EmbedBuilder } from 'discord.js';

export function embed(title, description) {
  return new EmbedBuilder()
    .setColor(0xe11d2e)
    .setTitle(title)
    .setDescription(description)
    .setFooter({ text: 'RTPySystems • RTCloud' })
    .setTimestamp();
}
