import fastifyPlugin from "fastify-plugin";
import { Redis } from "ioredis";
import configs from "../configs";

export default fastifyPlugin(async (server, options) => {
  const redis = new Redis({
    host: configs.redis.host,
    port: configs.redis.port,
    password: configs.redis.password
  });
  server.decorate("redis", redis);
});