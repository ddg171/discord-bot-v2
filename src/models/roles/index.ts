import { Timestamp } from '@google-cloud/firestore';

export type Role<T extends Date | Timestamp = Timestamp> = {
  id: string;
  name: string;
  guildId: string;
  createdAt: T;
};

export default class RoleModelClass {
  guildId: string;
  firestore: FirebaseFirestore.Firestore;
  collectionRef: FirebaseFirestore.CollectionReference;

  constructor(firestore: FirebaseFirestore.Firestore, guildId: string) {
    this.firestore = firestore;
    this.guildId = guildId;
    this.collectionRef = this.firestore
      .collection('guilds')
      .doc(this.guildId)
      .collection('roles');
  }

  async createRole(id: string, name: string): Promise<string> {
    const roleRef = this.collectionRef.doc(id);
    await roleRef.set({
      id,
      name,
      guildId: this.guildId,
      createdAt: new Date(),
    });
    return roleRef.id;
  }

  async deleteRole(roleId: string): Promise<void> {
    await this.collectionRef.doc(roleId).delete();
  }

  async getRoleByName(name: string): Promise<Role | null> {
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
    } as Role;
  }

  async listRoles(): Promise<Role[]> {
    const snapshot = await this.collectionRef.get();
    return snapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as Role)
    );
  }
}
