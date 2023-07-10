import {
  createLogger,
  format,
  transports
} from "winston";
import path from "path";
import fastifyPlugin from "fastify-plugin";
const PATH_ROOT = process.cwd();

export default fastifyPlugin(async (server, options) => {
  const Logger = createLogger({
    format: format.combine(
      format.splat(),
      format.timestamp({
        format: "DD/MM/YYYY HH:mm:ss"
      }),
      format.colorize(),
      format.printf(
        log => {
          if (log.stack) return `[${log.timestamp}] ${log.stack}`;
          return `[${log.timestamp}] ${log.message}`;
        }
      )
    ),
    transports: [
      new transports.Console(),
      new transports.File({
        level: 'error',
        filename: path.join(PATH_ROOT, './logs/errors.log')
      })
    ]
  })
  server.decorate("logger", Logger);
});