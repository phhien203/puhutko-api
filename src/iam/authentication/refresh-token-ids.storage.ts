import {
  Injectable,
  OnApplicationBootstrap,
  OnApplicationShutdown,
} from '@nestjs/common';
import Redis from 'ioredis';
import 'dotenv/config';

export class InvalidateRefreshTokenError extends Error {}

@Injectable()
export class RefreshTokenIdsStorage
  implements OnApplicationBootstrap, OnApplicationShutdown
{
  private redisClient!: Redis;

  onApplicationBootstrap() {
    this.redisClient = new Redis(process.env.REDIS_URL!);
  }

  onApplicationShutdown() {
    return this.redisClient?.quit();
  }

  async insert(userId: string, tokenId: string) {
    await this.redisClient.set(userId, tokenId);
  }

  async invalidate(userId: string) {
    await this.redisClient.del(userId);
  }

  async validate(userId: string, tokenId: string) {
    const storedId = await this.redisClient.get(userId);

    if (tokenId !== storedId) {
      throw new InvalidateRefreshTokenError();
    }

    return tokenId === storedId;
  }
}
