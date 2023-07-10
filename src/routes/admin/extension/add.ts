import { FastifyInstance } from "fastify";
import { Static, Type } from "@sinclair/typebox";
import bcrypt from "bcrypt";
const saltRounds = 10;

const BodySchema = Type.Object({
  name: Type.String(),
  url: Type.String(),
  token: Type.String(),
  timeout: Type.Optional(Type.Number()),
  timeout2: Type.Optional(Type.Number()),
  skipOTP: Type.Optional(Type.Boolean()),
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
        const { name, url, token, timeout , timeout2, skipOTP} = request.body;
        const response = await fastify.mongoose.Extension.create({
          name,
          url,
          token,
          timeout,
          timeout2,
          skipOTP,
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