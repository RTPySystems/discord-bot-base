import { Events } from 'discord.js';

export default {
  name: Events.Error,
  execute(err, client) {
    client.logger.error({ err }, 'Erro no cliente Discord.');
  },
};
