import {
  createCustomRunner,
  CustomRunnerOptions,
  initEnv,
  RemoteCacheImplementation,
} from "nx-remotecache-custom";
import { commandOptions, createClient } from "redis";

interface RedisRunnerOptions {
  user: string;
  password: string;
  port: number;
  host: string;
  database?: number;
}

const ENV_REDIS_USER = "NX_CACHE_REDIS_USER";
const ENV_REDIS_PASSWORD = "NX_CACHE_REDIS_PASSWORD";
const ENV_REDIS_PORT = "NX_CACHE_REDIS_PORT";
const ENV_REDIS_HOST = "NX_CACHE_REDIS_HOST";
const ENV_REDIS_DATABASE = "NX_CACHE_REDIS_DATABASE";

const getRedisClient = async (options: CustomRunnerOptions<RedisRunnerOptions>) => {
  const redisDatabase = process.env[ENV_REDIS_DATABASE] || options.database;
  const redisUser = process.env[ENV_REDIS_USER] || options.user;
  const redisPassword = process.env[ENV_REDIS_PASSWORD] || options.password;
  const redisPort = process.env[ENV_REDIS_PORT] || options.port;
  const redisHost = process.env[ENV_REDIS_HOST] || options.host;
  const redisClient = createClient({
    url: `redis://${redisUser}:${redisPassword}@${redisHost}:${redisPort}/${
      redisDatabase ? redisDatabase : ""
    }`,
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
      },
    };
  }
);
