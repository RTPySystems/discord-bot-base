import test from 'node:test';
import assert from 'node:assert/strict';
import { loadConfig, deployConfig } from '../src/config.js';

test('exige token e valida escopo de registro', () => {
  assert.throws(() => loadConfig({}), /DISCORD_TOKEN/);
  assert.throws(() => deployConfig({ DISCORD_TOKEN: 'teste' }), /DISCORD_CLIENT_ID/);
  const env = { DISCORD_TOKEN: 'teste', DISCORD_CLIENT_ID: '12345678901234567' };
  assert.throws(() => deployConfig(env), /DISCORD_GUILD_ID/);
  assert.equal(deployConfig(env, true).guildId, undefined);
  assert.throws(() => loadConfig({ ...env, LOG_LEVEL: 'errado' }), /LOG_LEVEL/);
});
