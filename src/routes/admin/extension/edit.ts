import { FastifyInstance } from "fastify";
import { Static, Type } from "@sinclair/typebox";
import { ParamSchema } from "../../../utils/datatable";
import bcrypt from "bcrypt";
const saltRounds = 10;

const BodySchema = Type.Object({
  name: Type.Optional(Type.String()),
  url: Type.Optional(Type.String()),
  token: Type.Optional(Type.String()),
  timeout: Type.Optional(Type.Number()),
  timeout2: Type.Optional(Type.Number()),
  skipOTP: Type.Optional(Type.Boolean()),
  logMessage: Type.Optional(Type.String()),
});

export default async (fastify: FastifyInstance) => {
  fastify.route<{
    Params: Static<typeof ParamSchema>,
    Body: Static<typeof BodySchema>
  }>({
    method: "POST",
    url: "/edit/:id",
    schema: {
      params: ParamSchema,
      body: BodySchema
    },
    handler: async (request, reply) => {
      try {
        const { id } = request.params;
        const response = await fastify.mongoose.Extension.findById(id);
        if (!response) throw new Error("Extension not found");
        const { name, url, token ,timeout, timeout2, skipOTP, logMessage} = request.body;
        if (name) response.name = name;
        if (url) response.url = url;
        if (token) response.token = token;
        if (timeout) response.timeout = timeout;
        if (timeout2) response.timeout2 = timeout2;
        if (logMessage) response.logMessage = logMessage;
        if (typeof skipOTP !== 'undefined') response.skipOTP = skipOTP;
        await response.save();
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