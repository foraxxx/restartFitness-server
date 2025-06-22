import express from "express"
import dotenv from "dotenv"
import sequelize from "./db.js"
import {
  Users,
  Statuses,
  Roles,
  Reviews,
  Trainers,
  Specializations,
  TrainerSpecializations,
  TrainerReviews,
  TrainingPackages,
  TrainingPackageTypes,
  UserTrainingPackages,
  News,
  NewsDocuments,
  NewsStatuses,
  Memberships,
  MembershipTypes,
  Promotions,
  UserMemberships,
  UserMembershipFreezings
} from "./models/index.js"
import cors from "cors"
import router from "./router/index.js"
import cookieParser from "cookie-parser"
import fileUpload from "express-fileupload"
import errorsMiddleware from "./middlewares/errorsMiddleware.js"
import path from "path"
import webhookRouter from "./router/webhook.js"
import './cron/cronRunner.js'

dotenv.config()
const PORT = process.env.PORT || 4000

const app = express()
app.use(cors({
  credentials: true,
  origin:process.env.CLIENT_URL
}))

app.options('*', cors());

app.use(cookieParser())
app.use(express.json())

app.use('/api/payments/notification', webhookRouter)
app.use(express.static(path.resolve(process.cwd(), 'static')));
app.use(fileUpload({}))
app.use('/api', router)
app.use(errorsMiddleware)

const start = async () => {
  try {
    await sequelize.authenticate()
    await sequelize.sync({ alter: true })
    app.listen(PORT, () => console.log(`Listening on port ${PORT}`))
  } catch(error) {
    console.log(error)
  }
}

start()

