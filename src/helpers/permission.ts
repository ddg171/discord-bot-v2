import { Message } from 'discord.js';

export class PermissionError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = 'PermissionError';
  }
}

export function isAuthorAdmin(message: Message): boolean {
  const permissions = message.member?.permissions;
  const isAdministrator = permissions?.has('Administrator');
  return isAdministrator || false;
}
