const redis = require('redis')

class RedisDB {
  constructor() {
    this.client = redis.createClient({
      host: (process.env.REDIS_HOST || '127.0.0.1'),
      port: (process.env.REDIS_PORT || '6379'),
      password: (process.env.REDIS_PASS || '')
    })
  }

  Check() {
    return new Promise((resolve, reject) => {
      this.client.get('test', (err, res) => {
        if (err) return reject('redis not connect')
        if (res === null || res == 'ok') return resolve('redis connect')
        return reject(res)
      })
    })
  }
}

module.exports = new RedisDB()
