import { Firestore } from '@google-cloud/firestore';
import * as path from 'path';
import GuildModelClass from './guilds';
import RoleModelClass from './roles';

// このファイルの場所
const __dirname = path.resolve();

const firestore = new Firestore({
  projectId: process.env.PROJECT_ID,
  keyFilename: path.join(__dirname, 'firestore-key.json'),
});

// 詳細なエラーログを有効にする
firestore.settings({
  ignoreUndefinedProperties: true,
});

export default firestore;

export const guildModelClass = new GuildModelClass(firestore);

export const getRoleModelClass = (guildId: string) =>
  new RoleModelClass(firestore, guildId);
