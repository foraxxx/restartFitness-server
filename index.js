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

dotenv.config()
const PORT = process.env.PORT || 4000

const app = express()
app.use(cors())
app.use(cookieParser())
app.use(express.json())
app.use(express.static(path.resolve(__dirname, "static")))
app.use(fileUpload({}))
app.use('/api', router)
app.use(errorsMiddleware)

const start = async () => {
  try {
    await sequelize.authenticate()
    await sequelize.sync()
    app.listen(PORT, () => console.log(`Listening on port ${PORT}`))
  } catch(error) {
    console.log(error)
  }
}

start()

