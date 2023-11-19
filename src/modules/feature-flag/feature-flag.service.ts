import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Injectable, Logger } from '@nestjs/common';
import { Redis } from 'ioredis';
import { IFeatureFlag } from './feature-flag.interface';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class FeatureFlagService {
  private readonly PREFIX_FLAG: string = 'ACBC_FF_';
  private readonly logger: Logger = new Logger(FeatureFlagService.name);
  constructor(@InjectRedis() private readonly redis: Redis) {}
  async get<T>(key: string): Promise<IFeatureFlag<T>> {
    const keyFlag = `${this.PREFIX_FLAG}${key}`;
    const flag = JSON.parse(await this.redis.get(keyFlag)) as IFeatureFlag<T>;

    return flag;
  }

  async set<T>(key: string, value: T, isEnabled: boolean) {
    try {
      const keyFlag = `${this.PREFIX_FLAG}${key}`;

      const flag: IFeatureFlag<T> = {
        id: uuidv4(),
        isEnabled,
        flag: keyFlag,
        config: value,
      };

      await this.redis.set(keyFlag, JSON.stringify(flag));
      return flag;
    } catch (error) {
      this.logger.error(error);
    }
  }

  async update<T>(key: string, value: T, isEnabled: boolean) {
    const keyFlag = `${this.PREFIX_FLAG}${key}`;
    const feature = await this.get(key);
    if (!feature) {
      return await this.set(key, value, isEnabled);
    }

    feature.config = value;
    feature.isEnabled = isEnabled;
    feature.config = value;

    await this.redis.set(keyFlag, JSON.stringify(feature));
    return feature;
  }
}
