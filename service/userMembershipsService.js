import {Statuses, UserMemberships} from "../models/index.js"

class UserMembershipsService {
  async create(userMembership) {
    const newUserMembershipData = await UserMemberships.create(userMembership)
    const userMembershipData = await UserMemberships.findByPk(newUserMembershipData.id, {include: {model: Statuses}})

    return userMembershipData
  }

  async getAllUserMemberships(userId) {
    const userMembershipsData = await UserMemberships.findAll({where: {UserId: userId}, include: {model: Statuses}})

    return userMembershipsData
  }
}

export default new UserMembershipsService()