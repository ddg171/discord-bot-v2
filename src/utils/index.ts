import { Message } from 'discord.js';

export function returnZero(): number {
  return 0;
}

export function showMessageInfo(message: Message) {
  console.log('timestamp:', new Date().toISOString());
  console.log(`Received message: ${message.content}`);
  console.log(`guild: ${message.guild}/${message.guild.id}`);
  console.log(`author: ${message.author}/${message.author.id}`);
  console.log(`channel: ${message.channel}/${message.channel.id}`);
  console.log(`messageType: ${message.type}`);

  // メッセージを送信したユーザーの権限
  const permissions = message.member?.permissions;
  const isAdministrator = permissions?.has('Administrator');
  console.log(`isAdministrator: ${isAdministrator}`);
}

export function showErrorInfo(error: Error) {
  console.error(`Error message: ${error.message}`);
  console.error(`Error stack: ${error.stack}`);
}

export function isValidCommand(routes: {}, command: string): boolean {
  return Object.keys(routes).includes(command);
}
