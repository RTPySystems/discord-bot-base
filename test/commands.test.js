import test from 'node:test';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { PermissionFlagsBits } from 'discord.js';
import { loadCommands } from '../src/handlers/loader.js';
import { createInteractionHandler } from '../src/handlers/interaction.js';

const commands = await loadCommands(fileURLToPath(new URL('../src/commands', import.meta.url)));
const logger = { error() {}, warn() {} };

function interaction(name, extra = {}) {
  const replies = [];
  return {
    replies,
    commandName: name,
    isChatInputCommand: () => true,
    inGuild: () => true,
    user: { id: '42' },
    appPermissions: { has: () => true },
    memberPermissions: { has: () => false },
    client: { ws: { ping: 12 } },
    reply: async (payload) => {
      replies.push(payload);
    },
    ...extra,
  };
}

test('carrega todos os comandos e gera definições válidas', () => {
  assert.deepEqual([...commands.keys()].sort(), ['help', 'ping', 'server']);
  for (const command of commands.values()) assert.ok(command.data.toJSON().description);
  assert.equal(commands.get('server').userPermissions, PermissionFlagsBits.ManageGuild);
});

test('responde ping com embed e aplica cooldown', async () => {
  const handle = createInteractionHandler({ commands, logger });
  const ctx = interaction('ping');
  await handle(ctx);
  assert.equal(ctx.replies[0].embeds[0].toJSON().title, 'Pong!');
  await handle(ctx);
  assert.match(ctx.replies[1].content, /Aguarde/);
});

test('nega comando administrativo sem permissão ou fora do servidor', async () => {
  const handle = createInteractionHandler({ commands, logger });
  const denied = interaction('server');
  await handle(denied);
  assert.match(denied.replies[0].content, /não tem permissão/);
  const dm = interaction('server', { inGuild: () => false });
  await handle(dm);
  assert.match(dm.replies[0].content, /servidor/);
});

test('valida permissão do bot e trata comando inexistente', async () => {
  const handle = createInteractionHandler({ commands, logger });
  const denied = interaction('ping', { appPermissions: { has: () => false } });
  await handle(denied);
  assert.match(denied.replies[0].content, /Preciso/);
  const missing = interaction('naoexiste');
  await handle(missing);
  assert.match(missing.replies[0].content, /não está disponível/);
});

test('captura erro e usa followUp para interação já respondida', async () => {
  const failing = new Map([
    [
      'falha',
      {
        data: { name: 'falha' },
        execute() {
          throw new Error('teste');
        },
      },
    ],
  ]);
  const ctx = interaction('falha', {
    replied: true,
    followUp: async (payload) => ctx.replies.push(payload),
  });
  await createInteractionHandler({ commands: failing, logger })(ctx);
  assert.match(ctx.replies[0].content, /Não consegui/);
});
