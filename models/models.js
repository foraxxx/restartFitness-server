import sequelize from "../db.js"
import { DataTypes } from "sequelize"

const Users = sequelize.define("Users", {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  name: {type: DataTypes.STRING(100), allowNull: false, required: true},
  surName: {type: DataTypes.STRING(100), allowNull: false, required: true},
  number: {type: DataTypes.BIGINT, allowNull: false, unique: true, required: true},
  email: {type: DataTypes.STRING(100), allowNull: true},
  avatar: {type: DataTypes.STRING(255), allowNull: true},
})

const Tokens = sequelize.define("Tokens", {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  refreshToken: {type: DataTypes.STRING, required: true},
})

const Statuses = sequelize.define("Statuses", {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  name: {type: DataTypes.STRING(20), allowNull: false, required: true},
})

const Roles = sequelize.define("Roles", {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  name: {type: DataTypes.STRING(100), allowNull: false, unique: true, required: true},
})

const Reviews = sequelize.define("Reviews", {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  description: {type: DataTypes.TEXT, allowNull: false, required: true},
  rating: {type: DataTypes.DECIMAL(2,1), allowNull: false, required: true},
  isAnonymous: {type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false, required: true},
})

const Trainers = sequelize.define("Trainers", {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  bio: {type: DataTypes.TEXT, allowNull: false, required: true},
  experience: {type: DataTypes.INTEGER, allowNull: false, required: true},
  photo: {type: DataTypes.STRING(255), allowNull: true, required: true},
  rating: {type: DataTypes.DECIMAL(2,1), allowNull: false, defaultValue: 0.0},
  vkLink: {type: DataTypes.STRING(100), allowNull: false, required: true},
})

const Specializations = sequelize.define("Specializations", {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  name: {type: DataTypes.STRING(100), allowNull: false, required: true},
})

const TrainerSpecializations = sequelize.define("TrainerSpecializations", {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
})

const TrainerReviews = sequelize.define("TrainerReviews", {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  description: {type: DataTypes.TEXT, allowNull: false, required: true},
  rating: {type: DataTypes.DECIMAL(2,1), allowNull: false, required: true},
  isAnonymous: {type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false, required: true},
})

const TrainingPackages = sequelize.define("TrainingPackages", {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  description: {type: DataTypes.TEXT, allowNull: false, required: true},
  countTrainings: {type: DataTypes.INTEGER, allowNull: false, required: true},
  packageDurationDays: {type: DataTypes.INTEGER, allowNull: false, required: true},
  price: {type: DataTypes.INTEGER, allowNull: false, required: true},
})

const TrainingPackageTypes = sequelize.define("TrainingPackageTypes", {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  name: {type: DataTypes.STRING(100), allowNull: false, required: true},
  maxClientCount: {type: DataTypes.INTEGER, allowNull: false, required: true},
})

const UserTrainingPackages = sequelize.define("UserTrainingPackages", {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  dateStart: {type: DataTypes.DATE, allowNull: false, required: true},
  dateEnd: {type: DataTypes.DATE, allowNull: false, required: true},
  countTrainings: {type: DataTypes.INTEGER, allowNull: false, required: true},
  price: {type: DataTypes.INTEGER, allowNull: false, required: true},
})

const News = sequelize.define("News", {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  text: {type: DataTypes.TEXT, allowNull: false, required: true},
  publicationDate: {type: DataTypes.DATE, allowNull: true, required: false},
})

const NewsDocuments = sequelize.define("NewsDocuments", {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  url: {type: DataTypes.STRING(255), allowNull: false, required: true},
  type: {type: DataTypes.STRING(20), allowNull: false, required: true},
})

const NewsStatuses = sequelize.define("NewsStatuses", {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  name: {type: DataTypes.STRING(20), allowNull: false, required: true},
})

const Memberships = sequelize.define("Memberships", {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  name: {type: DataTypes.STRING(100), allowNull: false, required: true},
  description: {type: DataTypes.TEXT, allowNull: false, required: true},
  photo: {type: DataTypes.STRING(255), allowNull: false, required: true},
  durationDays: {type: DataTypes.INTEGER, allowNull: false, required: true},
  isFreezing: {type: DataTypes.BOOLEAN, allowNull: false, required: true},
  freezingDays: {type: DataTypes.INTEGER, allowNull: false, defaultValue: 0},
  price: {type: DataTypes.INTEGER, allowNull: false, required: true},
})

const MembershipTypes = sequelize.define("MembershipTypes", {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  name: {type: DataTypes.STRING(100), allowNull: false, required: true},
  description: {type: DataTypes.TEXT, allowNull: false, required: true},
})

const Promotions = sequelize.define("Promotions", {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  promotionName: {type: DataTypes.STRING(100), allowNull: false},
  dateStart: {type: DataTypes.DATE, allowNull: false},
  dateEnd: {type: DataTypes.DATE, allowNull: false},
  discountedPrice: {type: DataTypes.INTEGER, allowNull: false},
})

const UserMemberships = sequelize.define("UserMemberships", {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  name: {type: DataTypes.STRING(100), allowNull: false, required: true},
  dateStart: {type: DataTypes.DATE, allowNull: false, required: true},
  dateEnd: {type: DataTypes.DATE, allowNull: false, required: true},
  freezingDays: {type: DataTypes.INTEGER, allowNull: false, defaultValue: 0},
})

const UserMembershipFreezings = sequelize.define("UserMembershipFreezings", {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  dateStart: {type: DataTypes.DATE, allowNull: false, required: true},
  dateEnd: {type: DataTypes.DATE, allowNull: false, required: true},
  freezingDays: {type: DataTypes.INTEGER, allowNull: false, required: true},
  document: {type: DataTypes.STRING(255), allowNull: false, required: true},
})

UserMemberships.hasMany(UserMembershipFreezings)
UserMembershipFreezings.belongsTo(UserMemberships)

Statuses.hasMany(UserMembershipFreezings)
UserMembershipFreezings.belongsTo(Statuses)

Statuses.hasMany(UserMemberships)
UserMemberships.belongsTo(Statuses)

Memberships.hasMany(UserMemberships)
UserMemberships.belongsTo(Memberships)

Users.hasMany(UserMemberships)
UserMemberships.belongsTo(Users)

Memberships.hasMany(Promotions)
Promotions.belongsTo(Memberships)

Statuses.hasMany(Promotions)
Promotions.belongsTo(Statuses)

MembershipTypes.hasMany(Memberships)
Memberships.belongsTo(MembershipTypes)

Statuses.hasMany(Memberships)
Memberships.belongsTo(Statuses)

News.hasMany(NewsDocuments)
NewsDocuments.belongsTo(News)

NewsStatuses.hasMany(News)
News.belongsTo(NewsStatuses)

Users.hasMany(News)
News.belongsTo(Users)

TrainingPackages.hasMany(UserTrainingPackages)
UserTrainingPackages.belongsTo(TrainingPackages)

Trainers.hasMany(UserTrainingPackages)
UserTrainingPackages.belongsTo(Trainers)

Statuses.hasMany(UserTrainingPackages)
UserTrainingPackages.belongsTo(Statuses)

Users.hasMany(UserTrainingPackages)
UserTrainingPackages.belongsTo(Users)

Statuses.hasMany(TrainingPackages)
TrainingPackages.belongsTo(Statuses)

Trainers.hasMany(TrainingPackages)
TrainingPackages.belongsTo(Trainers)

TrainingPackageTypes.hasMany(TrainingPackages)
TrainingPackages.belongsTo(TrainingPackageTypes)

Users.hasMany(TrainerReviews)
TrainerReviews.belongsTo(Users)

Trainers.hasMany(TrainerReviews)
TrainerReviews.belongsTo(Trainers)

Trainers.belongsToMany(Specializations, {foreignKey: 'TrainerId', through: TrainerSpecializations, as: 'specializations'})
Specializations.belongsToMany(Trainers, {foreignKey: 'SpecializationsId', through: TrainerSpecializations})

Users.hasOne(Trainers)
Trainers.belongsTo(Users)

Users.hasMany(Reviews)
Reviews.belongsTo(Users)

Users.hasMany(Tokens)
Tokens.belongsTo(Users)

Roles.hasMany(Users)
Users.belongsTo(Users)

export {
  Users,
  Tokens,
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
}