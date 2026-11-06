import { Events } from 'discord.js';

export default {
  name: Events.ClientReady,
  once: true,
  execute(readyClient, client) {
    client.logger.info(
      { bot: readyClient.user.username, servers: readyClient.guilds.cache.size },
      'Bot online.',
    );
  },
};
