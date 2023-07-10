import { FastifyInstance } from "fastify";
import { UserSchema, UserType } from "./schema";
import bcrypt from "bcrypt";

const saltRounds = 10;

export default async (fastify: FastifyInstance) => {
  fastify.route<{
    Body: UserType
  }>({
    method: "POST",
    url: "/register",
    schema: {
      body: UserSchema
    },
    handler: async (request, reply) => {
      try {
        const { username, password } = request.body;
        const salt = await bcrypt.genSalt(saltRounds);
        const hash = await bcrypt.hash(password, salt);
        const user = await fastify.mongoose.User.findOne({
          username
        });
        if (user) throw new Error("This account already exists");
        const response = await fastify.mongoose.User.create({
          username,
          password: hash
        });
        const token = fastify.jwt.sign({ username: response.username });
        reply.send({
          success: true,
          token,
          data: {
            username: response.username
          }
        });
      } catch (ex) {
        console.error(ex);
        throw new Error(ex);
      }
    }
  });
}