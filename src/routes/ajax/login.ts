import { FastifyInstance } from "fastify";
import { UserSchema, UserType } from "./schema";
import bcrypt from "bcrypt";

export default async (fastify: FastifyInstance) => {
  fastify.route<{
    Body: UserType
  }>({
    method: "POST",
    url: "/login",
    schema: {
      body: UserSchema
    },
    handler: async (request, reply) => {
      try {
        if (request.recaptcha.success) {
          const { username, password } = request.body;
          const user = await fastify.mongoose.User.findOne({
            username
          });
          console.log({ user })
          if (!user) return reply.send({ success: false, message: 'Incorrect username and password' });
          const verify = await bcrypt.compare(password, user.password);
          console.log({ verify });
          if (!verify) return reply.send({ success: false, message: 'Incorrect username and password' });
          const token = fastify.jwt.sign({ id: user.id, username: user.username });
          reply.send({
            success: true,
            token,
            user: {
              username: user.username
            }
          });
        } else {
          reply.send({
            success: false,
            message: "Recaptcha is not valid"
          });
        }
      } catch (ex) {
        throw new Error(ex);
      }
    }
  });
}