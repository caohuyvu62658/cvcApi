import { FastifyInstance } from "fastify";
import { Static, Type } from "@sinclair/typebox";
import { ParamSchema } from "../../../utils/datatable";

const BodySchema = Type.Object({
  tags: Type.Optional(Type.Array(Type.String())),
  cardNumberStatus: Type.Optional(Type.String()),
  otpStatus: Type.Optional(Type.String()),
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
        let { tags, cardNumberStatus, otpStatus } = request.body;
        if (otpStatus === 'failed') {
          cardNumberStatus = 'pending';
        }
        await fastify.mongoose.Cookie.findByIdAndUpdate(id, {
          tags,
          cardNumberStatus,
          otpStatus,
        });
        reply.send({
          success: true
        });
      } catch (ex) {
        throw new Error(ex);
      }
    }
  });
}