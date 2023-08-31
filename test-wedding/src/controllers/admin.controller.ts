import { PrismaClient } from "@prisma/client";
import * as fastify from "fastify";
import bcrypt from "bcrypt"
import jsonwebtoken from "jsonwebtoken"




export class AdminController {
    public async signUp(request: fastify.FastifyRequest, rep: fastify.FastifyReply) {
        const prisma = new PrismaClient()
        const data = JSON.parse(JSON.stringify(request.body))
        const saltRounds = 10;
        const salt = bcrypt.genSaltSync(saltRounds);
        const hash = bcrypt.hashSync(data.password, salt);
        try {
            await prisma.userAdmin.create({
                data: {
                    name: String(data.name),
                    username: String(data.username),
                    password: String(hash)
                }
            }).then(() => {
                return rep.status(201).send({
                    status: 201,
                    error: false,
                    message: "Success create admin"
                })
            }).catch((err) => {
                return rep.status(400).send({
                    status: 400,
                    error: true,
                    message: err
                })
            })
        } catch (e: any) {
            return rep.status(500).send({
                status: 500,
                error: true,
                message: e.message
            })
        }

    }


    public async signInAdmin(request: fastify.FastifyRequest, rep: fastify.FastifyReply) {
        const prisma = new PrismaClient()
        const data = JSON.parse(JSON.stringify(request.body))


        try {
            await prisma.userAdmin.findFirst({
                where: {
                    username: String(data.username),
                }
            }).then((dataUser) => {
                if (dataUser == null) {
                    return rep.status(400).send({
                        status: 400,
                        error: true,
                        message: "Username not found"
                    })
                } else {
                    const resultBcrypt = bcrypt.compareSync(data.password, dataUser.password);
                    if (!resultBcrypt) {
                        return rep.status(400).send({
                            status: 400,
                            error: true,
                            message: "Username or password is wrong"
                        })
                    } else {
                        const token = jsonwebtoken.sign({ id: dataUser.id }, String(process.env.SECRET_KEY), { expiresIn: '1h' });
                        return rep.status(200).send({
                            status: 200,
                            error: false,
                            token: token,
                            message: "Success login",
                        })
                    }

                }
            }).catch((err) => {
                return rep.status(400).send({
                    status: 400,
                    error: true,
                    message: err
                })
            })
        } catch (e: any) {
            return rep.status(500).send({
                status: 500,
                error: true,
                message: e.message
            })
        }
    }
}