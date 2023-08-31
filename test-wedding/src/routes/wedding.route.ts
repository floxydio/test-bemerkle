import fastify, { FastifyInstance } from "fastify"
import { GuestController } from "../controllers/guest.controller"
import { AdminController } from "../controllers/admin.controller"


export default function TodosRoute(app: FastifyInstance) {
    const guestController = new GuestController()
    const userController = new AdminController()

    app.post("/v1/admin/signup", userController.signUp)
    app.post("/v1/admin/signin", userController.signInAdmin)

    app.post("/v1/guestbook", guestController.createGuestBook)
    app.get("/v1/guestbook", guestController.getGuestBook)


}