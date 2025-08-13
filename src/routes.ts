import { Message } from 'discord.js';

export async function handleMessage(message: Message) {
  console.log(`Received message: ${message.content}`);
  console.log(`guild: ${message.guild}/${message.guild.id}`);
  console.log(`author: ${message.author}/${message.author.id}`);
  // メッセージを送信したユーザーの権限
  const permissions = message.member?.permissions;
  const isAdministrator = permissions?.has('Administrator');
  console.log(`isAdministrator: ${isAdministrator}`);
  // ユーザーのロール一覧
  const roles = message.member?.roles;
  roles?.cache.forEach((role) => {
    console.log(`role: ${role.name}/${role.id}`);
  });
}
