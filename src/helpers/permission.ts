import { GuildModel } from '@/models/guilds';
import { Message } from 'discord.js';

export class PermissionError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = 'PermissionError';
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
    throw new Error('Guild not found');
  }
  if (!guild.isEnabled) {
    throw new Error('Bot is not enabled in this guild');
  }
  return true;
}

export function isOnWatchChannel(guild: GuildModel, channelId: string) {
  if (!channelId) {
    throw new Error('Channel ID is required');
  }
  if (guild.watchChannelId !== channelId) {
    throw new Error('This channel is not allowed to create roles');
  }
}
