import {
  createCustomRunner,
  CustomRunnerOptions,
  initEnv,
  RemoteCacheImplementation,
} from "nx-remotecache-custom";
import { commandOptions, createClient } from "redis";

interface RedisRunnerOptions {
  url?: string;
  expire?: number;
}

const ENV_REDIS_URL = "NX_CACHE_REDIS_URL";
const ENV_REDIS_EXPIRE = "NX_CACHE_REDIS_EXPIRE";

const getRedisClient = async (options: CustomRunnerOptions<RedisRunnerOptions>) => {
  const redisUrl = process.env[ENV_REDIS_URL] || options.url;
  const redisClient = createClient({
    url: redisUrl,
  });
  redisClient.connect();
  return redisClient;
};

export default createCustomRunner<RedisRunnerOptions>(
  async (options): Promise<RemoteCacheImplementation> => {
    initEnv(options);
    const client = await getRedisClient(options);
    return {
      name: "Redis",
      fileExists: async (key: string): Promise<boolean> => {
        return !!client.exists(key);
      },
      retrieveFile: async (key: string): Promise<Buffer> => {
        return new Promise<Buffer>(async (resolve, reject) => {
          const data = await client.get(commandOptions({ returnBuffers: true }), key);
          if (data) {
            resolve(data as Buffer);
          } else {
            reject();
          }
        });
      },
      storeFile: async (key: string, data: Buffer): Promise<void> => {
        await client.set(key, data);
        const expire = process.env[ENV_REDIS_EXPIRE] || options.expire;
        if (expire && !!parseInt(String(expire))) {
          await client.expire(key, Number(expire));
        }
      },
    };
  }
);
