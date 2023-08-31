import Fastify, { FastifyInstance } from "fastify"
import dotenv from "dotenv"
import TodosRoute from "./routes/wedding.route"

dotenv.config()
const fastify: FastifyInstance = Fastify();

const start = async () => {
    try {
        fastify.register(require("@fastify/cors"))
        fastify.register(require("@fastify/formbody"))
        fastify.register(require("@fastify/helmet"), { global: true })
        fastify.register(require('@fastify/jwt'), {
            secret: process.env.SECRET_KEY
        })
        fastify.decorate("authenticate", async function (request: any, reply: any) {
            try {
                await request.jwtVerify()
            } catch (err) {
                reply.send(err)
            }
        })


        // Route
        TodosRoute(fastify)
        // End of Route

        await fastify.listen({ port: Number(process.env.PORT) });
        console.log(`Server started at ${process.env.PORT}`);
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};
start();