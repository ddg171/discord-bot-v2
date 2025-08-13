import { isAuthorAdmin, PermissionError } from '@/helpers/permission';
import { createGuild } from '@/models/guilds';
import { Message } from 'discord.js';

// Bot の応答チャンネル指定機能
export async function setupBot(message: Message): Promise<string> {
  const guild = message.guild;
  const channel = message.channel;
  if (!isAuthorAdmin(message)) {
    throw new PermissionError();
  }
  await createGuild(guild, channel.id);
  return 'Bot setup complete';
}

// Bot 機能の有効化、無効化機能
export function startWatching(): Promise<string> {}
export function stopWatching(): Promise<string> {
  return new Promise((resolve) => {
    // Bot 機能の無効化処理
    resolve('Bot stopped watching');
  });
}

// Bot の死活確認用応答機能
export function sendStatus(): Promise<string> {
  return new Promise((resolve) => {
    // Bot の死活確認用応答処理
    resolve('poripori');
  });
}

// Bot 起動時の通知機能
export function notifyBotReady(): Promise<string> {
  return new Promise((resolve) => {
    // Bot 起動時の通知処理
    resolve('Bot is ready');
  });
}
