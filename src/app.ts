import dotenv from "dotenv";
import fastify from "fastify";
import autoload from "@fastify/autoload";
import jwt from "@fastify/jwt";
import path from "path";
import cors from "@fastify/cors";
import redis from "./plugins/redis";
import logger from "./plugins/logger";
import mongoose from "./plugins/mongoose";
import { connect } from "mongoose";
import configs from "./configs";
import fastifyRecaptcha from "fastify-recaptcha";
dotenv.config();

const ADMIN = process.env.ADMIN;
const API = process.env.API;

const app = fastify({
  logger: false
});
app.register(cors);
app.register(redis);
app.register(logger);
app.register(mongoose);
app.register(fastifyRecaptcha, {
  recaptcha_secret_key: process.env.RECAPTCHA_SECRETKEY
})
app.register(jwt, {
  secret: process.env.SECRET,
  sign: {
    expiresIn: "7d"
  },
  formatUser: (user: {
    id: string,
    username: string,
    permission: string
  }) => {
    return {
      id: user.id,
      username: user.username,
      permission: user.permission
    }
  }
});

app.addHook("onRequest", async (request, reply) => {
  try {
    if ((request.url.startsWith(`/${ADMIN}`) && !request.url.includes("/ajax/")) || request.url.includes("/ajax/isLogin")) {
      await request.jwtVerify();
    } else return;
  } catch (err) {
    reply.send({
      status: false,
      message: err.message
    });
  }
});

app.register(autoload, {
  dir: path.resolve(__dirname, "routes", "admin"),
  options: {
    prefix: `/${ADMIN}`
  }
});

app.register(autoload, {
  dir: path.resolve(__dirname, "routes", "api"),
  options: {
    prefix: `/${API}`
  }
});

app.register(autoload, {
  dir: path.resolve(__dirname, "routes", "ajax"),
  options: {
    prefix: `/${ADMIN}/ajax`
  }
});

app.setNotFoundHandler((request, reply) => {
  reply.send({
    success: false,
    message: `Route ${request.method}:${request.url} not found`
  });
});


app.setErrorHandler((error, request, reply) => {
  reply.send({
    success: false,
    message: error.message
  });
});

connect(configs.mongo.mongoUri, {
  autoIndex: true,
  appName: configs.mongo.mongoName,
  dbName: configs.mongo.mongoName
}).then(async () => {
  app.listen({
    port: parseInt(process.env.PORT || "5000"),
    host: process.env.HOST || "0.0.0.0"
  }, async (err, address) => {
    if (err) {
      app.logger.error(err);
      process.exit(1);
    }
    app.logger.info(`Server listening on ${address}`);
  });
}).catch((err) => {
  console.log(err)
  app.logger.error(err);
  process.exit(1);
});