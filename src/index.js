import { fileURLToPath } from 'node:url';
import { Client, GatewayIntentBits } from 'discord.js';
import { loadConfig } from './config.js';
import { createLogger } from './lib/logger.js';
import { installShutdown } from './lib/shutdown.js';
import { startupError } from './lib/startup-error.js';
import { loadCommands, loadEvents } from './handlers/loader.js';
import { createInteractionHandler } from './handlers/interaction.js';

async function main() {
  const config = loadConfig();
  const logger = createLogger(config.logLevel);
  const client = new Client({
    intents: [GatewayIntentBits.Guilds],
    allowedMentions: { parse: [], repliedUser: false },
  });
  client.logger = logger;
  const lifecycle = installShutdown({ logger, stop: () => client.destroy() });
  try {
    client.commands = await loadCommands(fileURLToPath(new URL('./commands', import.meta.url)));
    client.handleInteraction = createInteractionHandler({ commands: client.commands, logger });
    await loadEvents(client, fileURLToPath(new URL('./events', import.meta.url)), logger);
    if (!lifecycle.isStopping()) await client.login(config.token);
  } catch (err) {
    await lifecycle.shutdown('startup', 1);
    throw err;
  }
}

main().catch(startupError);
