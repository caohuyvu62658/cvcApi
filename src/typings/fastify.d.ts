import { Redis } from "ioredis";
import { Logger } from "winston";
import { Cookie } from "../models/cookies.model";
import { Extension } from "../models/extension.model";
import { User } from "../models/user.model";

declare module "fastify" {
  interface FastifyInstance {
    logger: Logger,
    redis: Redis,
    mongoose: {
      Cookie: typeof Cookie,
      Extension: typeof Extension,
      User: typeof User
    }
  }
}