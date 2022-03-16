# nx-remotecache-redis

This is a task runner for @nrwl/nx https://nx.dev/react which uses a redis database as a remote caching storage. Read more about the benefits in the nx documentations [https://nx.dev/using-nx/caching#computation-caching]

This package was built with [nx-remotecache-custom](https://www.npmjs.com/package/nx-remotecache-custom) 🔥

## Setup

```
npm install -D nx-remotecache-redis
```

| Parameter      | Description                               | Environment Variable      | nx.json    |
| -------------- | ----------------------------------------- | ------------------------- | ---------- |
| Redis Username | Username to log in to your redis database | `NX_CACHE_REDIS_USER`     | `user`     |
| Redis Password | Password to log in to your redis database | `NX_CACHE_REDIS_PASSWORD` | `password` |
| Redis Port     | Port of the redis database                | `NX_CACHE_REDIS_PORT`     | `port`     |
| Redis Host     | Host IP of the redis database             | `NX_CACHE_REDIS_HOST`     | `host`     |
| Redis Database | Database number of the redis database     | `NX_CACHE_REDIS_DATABASE` | `database` |

```json
{
  "tasksRunnerOptions": {
    "default": {
      "runner": "nx-remotecache-redis",
      "options": {
        // All of the redis specific options can also be inserted via environment variables!
        "user": "root",
        "password": "password",
        "host": "127.0.0.1",
        "port": "6379",
        "database": 1,
        "cacheableOperations": ["build", "test", "lint", "e2e"]
      }
    }
  }
}
```
