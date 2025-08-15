import { getGuild } from '@/models/guilds';
import { Client, Message, User } from 'discord.js';

export type CommandArgObj = {
  author: User;
  target?: User[];
  command: string;
  args: string[];
  message: Message;
  client: Client;
};

export class TooBusyError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TooBusyError';
  }
}

export function parseMessage(message: Message): Omit<CommandArgObj, 'client'> {
  const author = message.author;
  const target = message.mentions?.users
    ? Array.from(message.mentions.users.values())
    : [];
  const content = message.content
    .trim()
    .replace(/<@!?(\d+)>/g, '')
    .trim();
  if (!content) {
    throw new Error('No command content found');
  }
  // 全角スペースを半角スペースに変換
  const commandRaw = content.replace(/　/g, ' ');
  const [command, ...args] = commandRaw.split(' ');
  return { author, target, command, args, message };
}

// リミット制限に達しているかどうかを確認する
export async function isLimitReached(
  guildId: string,
  limitSec: number = 3
): Promise<boolean> {
  const now = new Date().getTime();
  const guild = await getGuild(guildId);
  if (!guild) {
    return false; // ギルドが存在しない場合は制限に達していないとみなす
  }
  const lastRequestedAt = guild.lastRequestedAt.toDate().getTime();
  return now - lastRequestedAt < limitSec * 1000;
}

// 応答機能が有効になっているかどうかを確認する
export async function isResponseEnabled(guildId: string): Promise<boolean> {
  const guild = await getGuild(guildId);
  const isEnabled = guild ? guild.isEnabled : false;
  return isEnabled;
}

// ボットがメンションされているかどうかを確認する
export function isBotMentioned(message: Message): boolean {
  const botUserId = message.client.user?.id;
  const target = message.mentions?.users?.get(botUserId);
  return target !== undefined;
}
