import { readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { Collection } from 'discord.js';

async function modules(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const result = [];
  for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) result.push(...(await modules(path)));
    else if (entry.isFile() && entry.name.endsWith('.js')) {
      result.push((await import(pathToFileURL(path).href)).default);
    }
  }
  return result;
}

export async function loadCommands(directory) {
  const commands = new Collection();
  for (const command of await modules(directory)) {
    if (!command?.data?.toJSON || typeof command.execute !== 'function') {
      throw new Error('Comando inválido: exporte data e execute.');
    }
    const { name } = command.data.toJSON();
    if (commands.has(name)) throw new Error(`Comando duplicado: ${name}`);
    commands.set(name, command);
  }
  return commands;
}

export async function loadEvents(client, directory, logger) {
  for (const event of await modules(directory)) {
    if (!event?.name || typeof event.execute !== 'function') {
      throw new Error('Evento inválido: exporte name e execute.');
    }
    const run = (...args) => {
      Promise.resolve()
        .then(() => event.execute(...args, client))
        .catch((err) => logger.error({ err, event: event.name }, 'Falha no evento.'));
    };
    if (event.once) client.once(event.name, run);
    else client.on(event.name, run);
  }
}
