import express from "express"
import {
  createUser,
  home,
  login,
  loginUser,
  logout,
  posts,
  register,
} from "../controllers/controller.js"
import { verifyUser } from "../middlewares/middleware.js"
const router = express.Router()

router.get("/", home)
router.get("/login", login)
router.get("/register", register)
router.post("/register", createUser)
router.get("/posts", verifyUser, posts)
router.post("/login", loginUser)
router.post("/logout", logout)

export default router
