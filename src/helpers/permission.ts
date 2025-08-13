import { GuildModel } from '@/models/guilds';
import { Message } from 'discord.js';

export class PermissionError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = 'PermissionError';
  }
}

export class StatusError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = 'StatusError';
  }
}

// 無視しても良いエラー
export class IgnorableError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = 'IgnorableError';
  }
}

export function isAuthorAdmin(message: Message) {
  const permissions = message.member?.permissions;
  const isAdministrator = permissions?.has('Administrator');
  if (!isAdministrator) {
    throw new PermissionError(
      'You do not have permission to perform this action'
    );
  }
}

export function isEnabledGuild(guild: GuildModel) {
  if (!guild) {
    throw new StatusError('Guild not found');
  }
  if (!guild.isEnabled) {
    throw new IgnorableError('Bot is not enabled in this guild');
  }
}

export function isOnWatchChannel(guild: GuildModel, channelId: string) {
  if (!channelId) {
    throw new StatusError('Channel ID is required');
  }
  console.log(guild.watchChannelId);
  if (guild.watchChannelId !== channelId) {
    throw new IgnorableError('This channel is not allowed to create roles');
  }
}
