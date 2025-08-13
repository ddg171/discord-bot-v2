import { Timestamp } from '@google-cloud/firestore';
import { Guild } from 'discord.js';
import firestore from '..';

const collectionName = 'guilds';

export type GuildModel<T extends Date | Timestamp = Timestamp> = {
  id: string;
  name: string;
  ownerId: string;
  watchChannelId: string;
  isEnabled: boolean;
  createdAt: T;
  lastRequestedAt: T;
  updatedAt: T;
};

export async function createGuild(
  guild: Guild,
  watchChannelId: string
): Promise<FirebaseFirestore.WriteResult> {
  const now = new Date();
  const guildData: GuildModel<Date> = {
    id: guild.id,
    name: guild.name,
    ownerId: guild.ownerId,
    isEnabled: false,
    watchChannelId,
    createdAt: now,
    lastRequestedAt: now,
    updatedAt: now,
  };
  return await firestore
    .collection(collectionName)
    .doc(guild.id)
    .set(guildData);
}

export async function getGuild(guildId: string): Promise<GuildModel | null> {
  const doc = await firestore.collection(collectionName).doc(guildId).get();
  if (!doc.exists) {
    return null;
  }
  return { id: doc.id, ...doc.data() } as GuildModel;
}

async function _updateGuild(
  guildId: string,
  data: Partial<GuildModel<Date>>
): Promise<void> {
  await firestore
    .collection(collectionName)
    .doc(guildId)
    .update({ data, updatedAt: new Date() });
}

export async function updateGuildLastRequestedAt(
  guildId: string,
  lastRequestedAt: Date
): Promise<void> {
  await _updateGuild(guildId, { lastRequestedAt, updatedAt: new Date() });
}

export async function updateGuildWatchChannelId(
  guildId: string,
  watchChannelId: string
): Promise<void> {
  await _updateGuild(guildId, { watchChannelId, updatedAt: new Date() });
}

export async function updateGuildIsEnable(
  guildId: string,
  isEnabled: boolean
): Promise<void> {
  await _updateGuild(guildId, { isEnabled, updatedAt: new Date() });
}
