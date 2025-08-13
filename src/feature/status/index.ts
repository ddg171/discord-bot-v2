import { isAuthorAdmin, PermissionError } from '@/helpers/permission';
import { createGuild, listGuilds, updateGuildIsEnable } from '@/models/guilds';
import { Client, Message } from 'discord.js';

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
export async function startWatching(message: Message): Promise<string> {
  await updateGuildIsEnable(message.guild.id, true);
  return 'Bot started watching';
}
export async function stopWatching(message: Message): Promise<string> {
  await updateGuildIsEnable(message.guild.id, false);
  return 'Bot stopped watching';
}

// Bot の死活確認用応答機能
export function sendStatus(): Promise<string> {
  return new Promise((resolve) => {
    // Bot の死活確認用応答処理
    resolve('poripori');
  });
}

// Bot 起動時の通知機能
export async function notifyBotReady(
  client: Client
): Promise<PromiseSettledResult<void>[]> {
  const guilds = await listGuilds();
  const notifyTasks = guilds.map(async (guild) => {
    if (!guild.isEnabled) {
      return;
    }
    const discordGuild = await client.guilds.fetch(guild.id);
    if (!discordGuild) {
      console.error(`Guild not found: ${guild.id}`);
      return;
    }
    const channel = await discordGuild.channels.fetch(guild.watchChannelId);
    if (channel && channel.isTextBased()) {
      channel.send('ﾑｸﾘ');
    }
  });
  return Promise.allSettled(notifyTasks);
}
