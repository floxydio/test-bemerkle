import { PrismaClient } from "@prisma/client";
import { FastifyRequest, FastifyReply } from "fastify"
import jsonwebtoken from "jsonwebtoken"


export class GuestController {

    public async createGuestBook(request: FastifyRequest, rep: FastifyReply) {
        const prisma = new PrismaClient()
        const data = JSON.parse(JSON.stringify(request.body))
        try {
            await prisma.guestBook.create({
                data: {
                    name: String(data.name),
                    alamat: String(data.alamat),
                    noTelpon: Number(data.phone),
                    catatan: String(data.catatan)
                }
            }).then(() => {
                return rep.status(201).send({
                    status: 201,
                    error: false,
                    message: "Success create guest book"
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

    public async getGuestBook(request: FastifyRequest, rep: FastifyReply) {
        const prisma = new PrismaClient()
        const token = request.headers["authorization"]
        if (!token) {
            return rep.status(400).send({
                status: 400,
                error: true,
                message: "Token not found"
            })
        } else {
            const tokenJwt = token.split(" ")
            try {
                const verify = jsonwebtoken.verify(tokenJwt[1], `${process.env.SECRET_KEY}`)
                if (!verify) {
                    return rep.status(400).send({
                        status: 400,
                        error: true,
                        message: "Token not found"
                    })
                } else {
                    try {
                        await prisma.guestBook.findMany({
                            select: {
                                id: true,
                                name: true,
                                catatan: true,
                            },
                            orderBy: {
                                id: "desc"
                            }
                        }).then((data) => {
                            return rep.status(200).send({
                                status: 200,
                                error: false,
                                data: data,
                                message: "Success get guest book",

                            })
                        }).catch((err) => {
                            return rep.status(500).send({
                                status: 500,
                                error: true,
                                message: err
                            })
                        })

                    } catch (e) {
                        return rep.status(500).send({
                            status: 500,
                            error: true,
                            message: e
                        })
                    }
                }

            } catch (e: any) {
                return rep.status(400).send({
                    status: 400,
                    error: true,
                    message: e.message
                })
            }

        }

    }
}