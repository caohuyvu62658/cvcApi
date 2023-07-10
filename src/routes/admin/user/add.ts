import { FastifyInstance } from "fastify";
import { Static, Type } from "@sinclair/typebox";
import bcrypt from "bcrypt";
const saltRounds = 10;

const BodySchema = Type.Object({
  username: Type.String(),
  password: Type.String()
});

export default async (fastify: FastifyInstance) => {
  fastify.route<{
    Body: Static<typeof BodySchema>
  }>({
    method: "POST",
    url: "/add",
    schema: {
      body: BodySchema
    },
    handler: async (request, reply) => {
      try {
        const { username, password } = request.body;
        const salt = await bcrypt.genSalt(saltRounds);
        const hash = await bcrypt.hash(password, salt);
        const user = await fastify.mongoose.User.findOne({
          username
        });
        if (user) throw new Error("User already exists");
        const response = await fastify.mongoose.User.create({
          username,
          password: hash
        });
        reply.send({
          success: true,
          data: response
        });
      } catch (ex) {
        throw new Error(ex);
      }
    }
  });
}