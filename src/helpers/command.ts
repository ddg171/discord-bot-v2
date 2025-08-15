import { guildModelClass } from '@/models';
import { GuildModel } from '@/models/guilds';
import { ValidationError } from '@/utils/validator';
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
    throw new ValidationError();
  }
  // 全角スペースを半角スペースに変換
  const commandRaw = content.replace(/　/g, ' ');
  const [command, ...args] = commandRaw.split(' ');
  // 空白文字列の子要素を除外
  const argsFiltered = args.filter((arg) => arg.trim() !== '');

  return { author, target, command, args: argsFiltered, message };
}

// リミット制限に達しているかどうかを確認する
export function isLimitReached(guild: GuildModel, limitSec: number = 1) {
  const now = new Date().getTime();
  if (!guild) {
    return; // ギルドが存在しない場合は制限に達していないとみなす
  }
  const lastRequestedAt = guild.lastRequestedAt.toDate().getTime();
  const isTooBusy = now - lastRequestedAt < limitSec * 1000;
  if (isTooBusy) {
    throw new TooBusyError('リクエストが多すぎます');
  }
}

// 応答機能が有効になっているかどうかを確認する
export async function isResponseEnabled(guildId: string): Promise<boolean> {
  const guild = await guildModelClass.getGuild(guildId);
  const isEnabled = guild ? guild.isEnabled : false;
  return isEnabled;
}

// ボットがメンションされているかどうかを確認する
export function isBotMentioned(message: Message): boolean {
  const botUserId = message.client.user?.id;
  const target = message.mentions?.users?.get(botUserId);
  return target !== undefined;
}
