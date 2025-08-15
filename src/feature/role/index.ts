import { CommandArgObj, isLimitReached } from '@/helpers/command';
import {
  isAuthorAdmin,
  isEnabledGuild,
  isOnWatchChannel,
} from '@/helpers/permission';
import { getRoleModelClass, guildModelClass } from '@/models';

import { isValidRoleName, ValidationError } from '@/utils/validator';

// ロールの作成
export async function createRole(command: CommandArgObj): Promise<string> {
  const guild = await guildModelClass.getGuild(command.message.guild.id);
  const roleModel = getRoleModelClass(guild.id);
  isAuthorAdmin(command.message);
  isEnabledGuild(guild);
  isOnWatchChannel(guild, command.message.channel.id);
  isLimitReached(guild);

  // ロール作成処理
  if (!command.args[1]) {
    throw new ValidationError('ロール名がない');
  }
  const roleName = command.args[1].trim();
  isValidRoleName(roleName);

  // 作成済みロールの取得
  const existingRoles = await roleModel.listRoles();
  const roleLimitNumber = guild.roleLimitNumber;
  // 合計で10個までのロールを作成可能
  if (existingRoles.length >= roleLimitNumber) {
    return `${roleLimitNumber}個以上は無理`;
  }

  const duplicateRole = existingRoles.find((r) => r.name === roleName);
  if (duplicateRole) {
    return 'それはもうある';
  }

  const discordGuild = await command.client.guilds.fetch(guild.id);
  const newRole = await discordGuild.roles.create({
    name: roleName,
  });
  await roleModel.createRole(newRole.id, roleName);

  // 最終リクエスト時刻の更新
  await guildModelClass.updateGuildLastRequestedAt(guild.id);

  return `ロールを作成: ${roleName}`;
}

// ロールの削除
export async function deleteRole(command: CommandArgObj): Promise<string> {
  const guild = await guildModelClass.getGuild(command.message.guild.id);
  const roleModel = getRoleModelClass(guild.id);
  isAuthorAdmin(command.message);
  isEnabledGuild(guild);
  isOnWatchChannel(guild, command.message.channel.id);
  isLimitReached(guild);

  // ロール削除処理
  // firestoreから名前でロールを検索
  if (!command.args[1]) {
    throw new ValidationError('ロール名がない');
  }
  const role = await roleModel.getRoleByName(command.args[1]);
  if (!role) {
    throw new ValidationError('そのロールは知らない');
  }
  const roleId = role.id;
  const discordGuild = await command.client.guilds.fetch(guild.id);
  const discordRole = await discordGuild.roles.fetch(roleId);

  if (discordRole) {
    await discordRole.delete();
  }
  await roleModel.deleteRole(roleId);
  await guildModelClass.updateGuildLastRequestedAt(guild.id);

  return `ロールを削除: ${role.name}`;
}

// 作成済みロールの一覧表示
export async function listRoles(command: CommandArgObj): Promise<string> {
  const guild = await guildModelClass.getGuild(command.message.guild.id);
  const roleModel = getRoleModelClass(guild.id);
  isAuthorAdmin(command.message);
  isEnabledGuild(guild);
  isOnWatchChannel(guild, command.message.channel.id);
  isLimitReached(guild);

  // ロール削除処理
  // firestoreから名前でロールを検索
  const existingRoles = await roleModel.listRoles();
  if (!existingRoles.length) {
    return 'ロールはまだない';
  }
  const message = existingRoles.map((role) => `- ${role.name}`).join('\n');
  return `作成済みロール\n${message}`;
}

// ロールを付与されているユーザーの一覧表示
export async function listUsersWithRole(
  command: CommandArgObj
): Promise<string> {
  const guild = await guildModelClass.getGuild(command.message.guild.id);
  const roleModel = getRoleModelClass(guild.id);
  isEnabledGuild(guild);
  isOnWatchChannel(guild, command.message.channel.id);
  isLimitReached(guild);

  // ロールを付与されているユーザーの一覧表示処理
  if (!command.args[1]) {
    throw new ValidationError('ロール名がない');
  }
  const role = await roleModel.getRoleByName(command.args[1]);
  if (!role) {
    return 'そのロールは知らない';
  }
  const guildMembers = await command.message.guild.members.fetch();

  const membersWithRole = guildMembers.filter((member) =>
    member.roles.cache.has(role.id)
  );

  if (!membersWithRole.size) {
    return 'そのロールを付与されているユーザーはいない';
  }
  const userList = membersWithRole
    .map((member) => `- ${member.user.username}`)
    .join('\n');
  return `ロールを付与されているユーザー:\n${userList}`;
}

// ロールの付与
export async function assignRole(command: CommandArgObj): Promise<string> {
  const guild = await guildModelClass.getGuild(command.message.guild.id);
  const roleModel = getRoleModelClass(guild.id);
  isEnabledGuild(guild);
  isOnWatchChannel(guild, command.message.channel.id);
  isLimitReached(guild);

  // ロール付与処理
  if (!command.args[1]) {
    return 'ロール名を指定してください';
  }
  const role = await roleModel.getRoleByName(command.args[1]);
  if (!role) {
    return 'そのロールは知らない';
  }
  const member = await command.message.guild.members.fetch(command.author.id);
  if (!member) {
    return 'お前は誰だ';
  }
  await member.roles.add(role.id);
  await guildModelClass.updateGuildLastRequestedAt(guild.id);
  return `ロールを付与: ${role.name}`;
}

// ロールの取り消し
export async function removeRole(command: CommandArgObj): Promise<string> {
  const guild = await guildModelClass.getGuild(command.message.guild.id);
  const roleModel = getRoleModelClass(guild.id);
  isEnabledGuild(guild);
  isOnWatchChannel(guild, command.message.channel.id);
  isLimitReached(guild);

  // ロール取り消し処理
  if (!command.args[1]) {
    return 'ロール名を指定してください';
  }
  const role = await roleModel.getRoleByName(command.args[1]);
  if (!role) {
    return 'そのロールは知らない';
  }
  const member = await command.message.guild.members.fetch(command.author.id);
  if (!member) {
    return 'お前は誰だ';
  }
  await member.roles.remove(role.id);
  await guildModelClass.updateGuildLastRequestedAt(guild.id);
  return `ロールを削除: ${role.name}`;
}
