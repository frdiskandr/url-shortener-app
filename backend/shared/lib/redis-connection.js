import { config } from "../utils/config.js"
import { logger } from "../utils/logger.js"
import { createClient } from "redis"

const client = createClient({
  username: config.REDIS_USER || undefined,
  password: config.REDIS_PASSWORD || undefined,
  socket: {
    host: config.REDIS_HOST,
    port: Number(config.REDIS_PORT),
  },
})

client.on("error", (err) => {
  logger.error("redis client error", { error: err })
  process.exit(1)
})

let connectPromise = null

const ensureConnected = async () => {
  if (connectPromise) {
    return connectPromise
  }

  connectPromise = (async () => {
    try {
      if (!client.isOpen) {
        await client.connect()
      }

      return client
    } catch (error) {
      connectPromise = null
      throw error
    }
  })()

  return connectPromise
}

const withRedisClient = async (operation) => {
  try {
    const redisClient = await ensureConnected()
    return await operation(redisClient)
  } catch (error) {
    logger.error("redis client error", { error })
    throw error
  }
}

export const SetRedis = async (key, value, ttlSeconds = 60) => {
  return withRedisClient((redisClient) => redisClient.set(key, value, { EX: ttlSeconds }))
}

export const GetRedis = async (key) => {
  return withRedisClient((redisClient) => redisClient.get(key))
}

export const DeleteRedis = async (key) => {
  return withRedisClient((redisClient) => redisClient.del(key))
}