import { CommandArgObj } from '@/helpers/command';
import {
  isAuthorAdmin,
  isEnabledGuild,
  isOnWatchChannel,
} from '@/helpers/permission';
import { getGuild } from '@/models/guilds';
import getRoleModel from '@/models/roles';
import { isValidRoleName } from '@/utils/validator';

// ロールの作成
export async function createRole(command: CommandArgObj): Promise<string> {
  const guild = await getGuild(command.message.guild.id);
  const roleModel = getRoleModel(guild.id);
  isAuthorAdmin(command.message);
  isEnabledGuild(guild);
  isOnWatchChannel(guild, command.message.channel.id);

  // ロール作成処理
  const roleName = command.args[1].trim();
  isValidRoleName(roleName);

  // 作成済みロールの取得
  const existingRoles = await roleModel.listRoles();
  // 合計で10個までのロールを作成可能
  if (existingRoles.length >= 10) {
    throw new Error('ロールは最大10個まで作成可能です');
  }

  const duplicateRole = existingRoles.find((r) => r.name === roleName);
  if (duplicateRole) {
    throw new Error('duplicate role');
  }

  const discordGuild = await command.client.guilds.fetch(guild.id);
  const newRole = await discordGuild.roles.create({
    name: roleName,
  });
  await roleModel.createRole(newRole.id, roleName);

  return `ロールを作成しました: ${roleName}`;
}

// ロールの削除
export async function deleteRole(command: CommandArgObj): Promise<string> {
  const guild = await getGuild(command.message.guild.id);
  const roleModel = getRoleModel(guild.id);
  isAuthorAdmin(command.message);
  isEnabledGuild(guild);
  isOnWatchChannel(guild, command.message.channel.id);

  // ロール削除処理
  // firestoreから名前でロールを検索
  const role = await roleModel.getRoleByName(command.args[1]);
  if (!role) {
    throw new Error(`Role not found: ${command.args[1]}`);
  }
  const roleId = role.id;
  const discordGuild = await command.client.guilds.fetch(guild.id);
  const discordRole = await discordGuild.roles.fetch(roleId);

  if (discordRole) {
    await discordRole.delete();
  }
  await roleModel.deleteRole(roleId);

  return `ロールを削除しました: ${role.name}`;
}

// 作成済みロールの一覧表示
export function listRoles(): Promise<string> {
  return new Promise((resolve) => {
    // ロール一覧表示処理
    resolve('List of roles');
  });
}

// ロールを付与されているユーザーの一覧表示
export function listUsersWithRole(): Promise<string> {
  return new Promise((resolve) => {
    // ロールを付与されているユーザーの一覧表示処理
    resolve('List of users with role');
  });
}

// ロールの付与、取り消し
export function assignRole(): Promise<string> {
  return new Promise((resolve) => {
    // ロールの付与処理
    resolve('Role assigned');
  });
}
export function removeRole(): Promise<string> {
  return new Promise((resolve) => {
    // ロールの取り消し処理
    resolve('Role removed');
  });
}

// 使用されていないロールの自動削除機能
export function autoRemoveUnusedRoles(): Promise<string> {
  return new Promise((resolve) => {
    // 使用されていないロールの自動削除処理
    resolve('Unused roles removed');
  });
}
