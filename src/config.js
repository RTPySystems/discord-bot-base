import { logLevel, required } from './lib/env.js';

export function loadConfig(env = process.env) {
  return {
    token: required(env, 'DISCORD_TOKEN'),
    logLevel: logLevel(env),
  };
}

export function deployConfig(env = process.env, global = false) {
  return {
    ...loadConfig(env),
    clientId: required(env, 'DISCORD_CLIENT_ID', /^\d{17,20}$/),
    guildId: global ? undefined : required(env, 'DISCORD_GUILD_ID', /^\d{17,20}$/),
  };
}
