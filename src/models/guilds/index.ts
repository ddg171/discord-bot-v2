import { Timestamp } from '@google-cloud/firestore';
import { Guild } from 'discord.js';

const collectionName = 'guilds';

export type GuildModel<T extends Date | Timestamp = Timestamp> = {
  id: string;
  name: string;
  ownerId: string;
  watchChannelId: string;
  roleLimitNumber: number;
  isEnabled: boolean;
  createdAt: T;
  lastRequestedAt: T;
  updatedAt: T;
};

export default class GuildModelClass {
  firestore: FirebaseFirestore.Firestore;
  collectionRef: FirebaseFirestore.CollectionReference;

  constructor(firestore: FirebaseFirestore.Firestore) {
    this.firestore = firestore;
    this.collectionRef = this.firestore.collection(collectionName);
  }

  async createGuild(guild: Guild, watchChannelId: string): Promise<string> {
    const now = new Date();
    const guildData: GuildModel<Date> = {
      id: guild.id,
      name: guild.name,
      ownerId: guild.ownerId,
      isEnabled: false,
      roleLimitNumber: Number(process.env.ROLE_NUM_LIMIT) || 10,
      watchChannelId,
      createdAt: now,
      lastRequestedAt: now,
      updatedAt: now,
    };
    const guildRef = this.collectionRef.doc(guild.id);
    await guildRef.set(guildData);
    return guildRef.id;
  }

  private async _deleteGuild(guildId: string): Promise<void> {
    await this.collectionRef.doc(guildId).delete();
  }

  async getGuild(guildId: string): Promise<GuildModel | null> {
    const doc = await this.collectionRef.doc(guildId).get();
    if (!doc.exists) {
      return null;
    }
    return { id: doc.id, ...doc.data() } as GuildModel;
  }

  async getGuildByName(name: string): Promise<GuildModel | null> {
    if (!name || typeof name !== 'string') {
      return null;
    }
    const snapshot = await this.collectionRef.where('name', '==', name).get();
    if (snapshot.empty) {
      return null;
    }
    const doc = snapshot.docs[0];
    return {
      id: doc.id,
      ...doc.data(),
    } as GuildModel;
  }

  async listGuilds(): Promise<GuildModel[]> {
    const snapshot = await this.collectionRef
      .orderBy('lastRequestedAt', 'desc')
      .limit(10)
      .get();
    return snapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as GuildModel)
    );
  }

  private async _updateGuild(
    guildId: string,
    data: Partial<GuildModel<Date>>
  ): Promise<void> {
    const now = new Date();
    await this.collectionRef.doc(guildId).update({ ...data, updatedAt: now });
  }

  async updateGuildLastRequestedAt(guildId: string): Promise<void> {
    const now = new Date();
    await this._updateGuild(guildId, {
      lastRequestedAt: now,
      updatedAt: now,
    });
  }

  async updateGuildWatchChannelId(
    guildId: string,
    watchChannelId: string
  ): Promise<void> {
    const now = new Date();
    await this._updateGuild(guildId, {
      watchChannelId,
      lastRequestedAt: now,
      updatedAt: now,
    });
  }

  async updateGuildIsEnable(
    guildId: string,
    isEnabled: boolean
  ): Promise<void> {
    const now = new Date();

    await this._updateGuild(guildId, {
      isEnabled,
      lastRequestedAt: now,
      updatedAt: now,
    });
  }
}
