import express from "express"
import dotenv from "dotenv"
dotenv.config()
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

const PORT = process.env.PORT || 4000

const app = express()
app.use(cors())
app.use(express.json())

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

