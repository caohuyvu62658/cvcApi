import { Static } from "@sinclair/typebox";
import { FastifyInstance } from "fastify";
import { AjaxSchema, genQuery } from "../../../utils/datatable";

export default async (fastify: FastifyInstance) => {
  fastify.route<{
    Body: Static<typeof AjaxSchema>
  }>({
    method: "POST",
    url: "/ajax",
    schema: {
      body: AjaxSchema
    },
    handler: async (request, reply) => {
      try {
        const query = genQuery(request.body);
        const response: any = await fastify.mongoose.Extension.find(query.where)
          .sort(query.sort)
          .limit(query.limit)
          .skip(query.skip);
        const total = await fastify.mongoose.Extension.count(query.where);
        reply.send({
          success: true,
          data: response,
          recordsTotal: total,
          recordsFiltered: total,
          pages: Math.ceil(total / query.limit)
        });
      } catch (ex) {
        throw new Error(ex);
      }
    }
  });
}