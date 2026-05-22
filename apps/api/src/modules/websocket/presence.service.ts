import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

const PRESENCE_TTL = 300; // 5 minutes
const PRESENCE_KEY = (userId: string) => `presence:${userId}`;

@Injectable()
export class PresenceService {
  constructor(@Inject(CACHE_MANAGER) private cache: Cache) {}

  async setOnline(userId: string, socketId: string) {
    await this.cache.set(
      PRESENCE_KEY(userId),
      { status: 'ONLINE', socketId, lastSeenAt: new Date().toISOString() },
      PRESENCE_TTL,
    );
  }

  async setOffline(userId: string) {
    await this.cache.set(
      PRESENCE_KEY(userId),
      { status: 'OFFLINE', lastSeenAt: new Date().toISOString() },
      PRESENCE_TTL * 2,
    );
  }

  async refreshPresence(userId: string) {
    const current = await this.cache.get<any>(PRESENCE_KEY(userId));
    if (current) {
      await this.cache.set(PRESENCE_KEY(userId), { ...current, lastSeenAt: new Date().toISOString() }, PRESENCE_TTL);
    }
  }

  async getPresence(userId: string) {
    return this.cache.get<{ status: string; lastSeenAt: string }>(PRESENCE_KEY(userId));
  }

  async getBulkPresence(userIds: string[]) {
    const results = await Promise.all(userIds.map((id) => this.getPresence(id)));
    return userIds.reduce(
      (acc, id, i) => {
        acc[id] = results[i] || { status: 'OFFLINE', lastSeenAt: null };
        return acc;
      },
      {} as Record<string, any>,
    );
  }
}
