import { CommandArgObj } from '@/helpers/command';
import { isAuthorAdmin, isOnWatchChannel } from '@/helpers/permission';
import {
  createGuild,
  getGuild,
  listGuilds,
  updateGuildIsEnable,
} from '@/models/guilds';
import { Client } from 'discord.js';

// Bot の応答チャンネル指定機能
export async function setupBot(command: CommandArgObj): Promise<string> {
  isAuthorAdmin(command.message);

  const guild = command.message.guild;
  const channel = command.message.channel;
  await createGuild(guild, channel.id);
  return 'ここをキャンプ地とする';
}

// Bot 機能の有効化、無効化機能
export async function startWatching(command: CommandArgObj): Promise<string> {
  await updateGuildIsEnable(command.message.guild.id, true);
  return '応答機能を有効化';
}
export async function stopWatching(command: CommandArgObj): Promise<string> {
  await updateGuildIsEnable(command.message.guild.id, false);
  return '応答機能を無効化';
}

// Bot の死活確認用応答機能
export async function sendStatus(command: CommandArgObj): Promise<string> {
  const guild = await getGuild(command.message.guild.id);
  isOnWatchChannel(guild, command.message.channel.id);
  return 'ポリポリ';
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
