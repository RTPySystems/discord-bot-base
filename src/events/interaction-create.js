import { Events } from 'discord.js';

export default {
  name: Events.InteractionCreate,
  execute(interaction, client) {
    return client.handleInteraction(interaction);
  },
};
