# nx-remotecache-redis

This is a task runner for @nrwl/nx https://nx.dev/react which uses a redis database as a remote caching storage. Read more about the benefits in the nx documentations [https://nx.dev/using-nx/caching#computation-caching]

This package was built with [nx-remotecache-custom](https://www.npmjs.com/package/nx-remotecache-custom) 🔥

## Setup

```
npm install -D nx-remotecache-redis
```

| Parameter | Description                                                                         | Environment Variable | nx.json |
| --------- | ----------------------------------------------------------------------------------- | -------------------- | ------- |
| Redis URL | The url to connect to redis for example: `redis://<user>:<password>@127.0.0.1:6379` | `NX_CACHE_REDIS_URL` | `url`   |

```json
{
  "tasksRunnerOptions": {
    "default": {
      "runner": "nx-remotecache-redis",
      "options": {
        // All of the redis specific options can also be inserted via environment variables!
        "url": "redis://127.0.0.1:6379",
        "cacheableOperations": ["build", "test", "lint", "e2e"]
      }
    }
  }
}
```
