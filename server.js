import dotenv from "dotenv"
import express from "express"
import path from "node:path"
import { fileURLToPath } from "node:url"

import route from "./routes/routes.js"
import mongoose from "mongoose"
import session from "express-session"
import MongoStore from "connect-mongo"
import flash from "connect-flash"
// ==========
// App initialization
// ==========
dotenv.config()
const { APP_HOSTNAME, APP_PORT, MONGODB_URL } = process.env

mongoose.connect(MONGODB_URL)

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(flash())

app.set("view engine", "pug")

app.use(
  session({
    name: "simple",
    secret: "simple",
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: MONGODB_URL }),
  })
)

// ==========
// App middlewares
// ==========

app.use(express.static(path.join(__dirname, "public")))

// ==========
// App routers
// ==========

app.use("/", route)

// ==========
// App start
// ==========

app.listen(APP_PORT, () => {
  console.log(`App listening at http://${APP_HOSTNAME}:${APP_PORT}`)
})
