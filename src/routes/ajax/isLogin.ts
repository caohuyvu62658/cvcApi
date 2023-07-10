import { FastifyInstance } from "fastify";

export default async (fastify: FastifyInstance) => {
  fastify.route({
    method: "GET",
    url: "/isLogin",
    handler: async (request, reply) => {
      reply.send({
        success: true,
        data: request.user
      });
    }
  });
}