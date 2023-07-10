import { FastifyInstance } from "fastify";
import { Static } from "@sinclair/typebox";
import { ParamSchema } from "../../../utils/datatable";

export default async (fastify: FastifyInstance) => {
  fastify.route<{
    Params: Static<typeof ParamSchema>
  }>({
    method: "POST",
    url: "/delete/:id",
    schema: {
      params: ParamSchema
    },
    handler: async (request, reply) => {
      try {
        const { id } = request.params;
        await fastify.mongoose.Cookie.findByIdAndDelete(id);
        reply.send({
          success: true
        });
      } catch (ex) {
        throw new Error(ex);
      }
    }
  });
}