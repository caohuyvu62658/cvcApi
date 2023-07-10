import fastifyPlugin from "fastify-plugin";
import { Cookie } from "../models/cookies.model";
import { Extension } from "../models/extension.model";
import { User } from "../models/user.model";

export default fastifyPlugin(async (server, options) => {
  const mongoose = {
    Cookie,
    Extension,
    User
  }
  server.decorate("mongoose", mongoose);
});