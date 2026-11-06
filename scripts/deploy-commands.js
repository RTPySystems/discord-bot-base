import { fileURLToPath } from 'node:url';
import { REST, Routes } from 'discord.js';
import { deployConfig } from '../src/config.js';
import { loadCommands } from '../src/handlers/loader.js';
import { createLogger } from '../src/lib/logger.js';
import { startupError } from '../src/lib/startup-error.js';

async function deploy() {
  const global = process.argv.includes('--global');
  const config = deployConfig(process.env, global);
  const commands = await loadCommands(fileURLToPath(new URL('../src/commands', import.meta.url)));
  const route = global
    ? Routes.applicationCommands(config.clientId)
    : Routes.applicationGuildCommands(config.clientId, config.guildId);
  // PUT substitui os comandos desse escopo; o registro não roda na inicialização.
  await new REST({ version: '10' }).setToken(config.token).put(route, {
    body: [...commands.values()].map((command) => command.data.toJSON()),
  });
  createLogger(config.logLevel).info(
    { total: commands.size, scope: global ? 'global' : 'guild' },
    'Comandos registrados.',
  );
}

deploy().catch(startupError);
