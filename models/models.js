import sequelize from "../db.js"
import { DataTypes } from "sequelize"

const Users = sequelize.define("Users", {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  name: {type: DataTypes.STRING(100), allowNull: false},
  surName: {type: DataTypes.STRING(100), allowNull: false},
  number: {type: DataTypes.INTEGER, allowNull: false, unique: true},
  email: {type: DataTypes.STRING(100), allowNull: true},
  avatar: {type: DataTypes.STRING(255), allowNull: true},
})

const Statuses = sequelize.define("Statuses", {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  name: {type: DataTypes.STRING(20), allowNull: false},
})

const Roles = sequelize.define("Roles", {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  name: {type: DataTypes.STRING(100), allowNull: false, unique: true},
})

const Reviews = sequelize.define("Reviews", {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  description: {type: DataTypes.TEXT, allowNull: false},
  rating: {type: DataTypes.DECIMAL(2,1), allowNull: false},
  isAnonymous: {type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false},
})

const Trainers = sequelize.define("Trainers", {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  bio: {type: DataTypes.TEXT, allowNull: false},
  experience: {type: DataTypes.INTEGER, allowNull: false},
  photo: {type: DataTypes.STRING(255), allowNull: true},
  rating: {type: DataTypes.DECIMAL(2,1), allowNull: false, defaultValue: 0.0},
  vkLink: {type: DataTypes.STRING(100), allowNull: false},
})

const Specializations = sequelize.define("Specializations", {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  name: {type: DataTypes.STRING(100), allowNull: false},
})

const TrainerSpecializations = sequelize.define("TrainerSpecializations", {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
})

const TrainerReviews = sequelize.define("TrainerReviews", {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  description: {type: DataTypes.TEXT, allowNull: false},
  rating: {type: DataTypes.DECIMAL(2,1), allowNull: false},
  isAnonymous: {type: DataTypes.BOOLEAN, allowNull: false},
})

const TrainingPackages = sequelize.define("TrainingPackages", {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  description: {type: DataTypes.TEXT, allowNull: false},
  countTrainings: {type: DataTypes.INTEGER, allowNull: false},
  packageDurationDays: {type: DataTypes.INTEGER, allowNull: false},
  price: {type: DataTypes.INTEGER, allowNull: false},
})

const TrainingPackageTypes = sequelize.define("TrainingPackageTypes", {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  name: {type: DataTypes.STRING(100), allowNull: false},
  maxClientCount: {type: DataTypes.INTEGER, allowNull: false},
})

const UserTrainingPackages = sequelize.define("UserTrainingPackages", {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  dateStart: {type: DataTypes.DATE, allowNull: false},
  dateEnd: {type: DataTypes.DATE, allowNull: false},
  countTrainings: {type: DataTypes.INTEGER, allowNull: false},
  price: {type: DataTypes.INTEGER, allowNull: false},
})

const News = sequelize.define("News", {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  text: {type: DataTypes.TEXT, allowNull: false},
  publicationDate: {type: DataTypes.DATE, allowNull: false},
})

const NewsDocuments = sequelize.define("NewsDocuments", {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  url: {type: DataTypes.STRING(255), allowNull: false},
  type: {type: DataTypes.STRING(20), allowNull: false},
})

const NewsStatuses = sequelize.define("NewsStatuses", {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  name: {type: DataTypes.STRING(20), allowNull: false},
})

const Memberships = sequelize.define("Memberships", {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  name: {type: DataTypes.STRING(100), allowNull: false},
  description: {type: DataTypes.TEXT, allowNull: false},
  photo: {type: DataTypes.STRING(255), allowNull: false},
  durationDays: {type: DataTypes.INTEGER, allowNull: false},
  isFreezing: {type: DataTypes.BOOLEAN, allowNull: false},
  freezingDays: {type: DataTypes.INTEGER, allowNull: false, defaultValue: 0},
  price: {type: DataTypes.INTEGER, allowNull: false},
})

const MembershipTypes = sequelize.define("MembershipTypes", {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  name: {type: DataTypes.STRING(100), allowNull: false},
  description: {type: DataTypes.TEXT, allowNull: false},
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
  name: {type: DataTypes.STRING(100), allowNull: false},
  dateStart: {type: DataTypes.DATE, allowNull: false},
  dateEnd: {type: DataTypes.DATE, allowNull: false},
  freezingDays: {type: DataTypes.INTEGER, allowNull: false, defaultValue: 0},
})

const UserMembershipFreezings = sequelize.define("UserMembershipFreezings", {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  dateStart: {type: DataTypes.DATE, allowNull: false},
  dateEnd: {type: DataTypes.DATE, allowNull: false},
  freezingDays: {type: DataTypes.INTEGER, allowNull: false},
  document: {type: DataTypes.STRING(255), allowNull: false},
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

Roles.hasMany(Users)
Users.belongsTo(Users)

export {
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
}