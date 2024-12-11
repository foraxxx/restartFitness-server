import {Memberships} from "../models/index.js"

class MembershipService {
  async create(membership) {
    const membershipData = await Memberships.create(membership)

    return membershipData
  }

  async getAll() {
    const membershipsData = await Memberships.findAll()

    return membershipsData
  }

  async getOne(id) {
    const membershipData = await Memberships.findByPk(id)

    return membershipData
  }

  async updateOne(id, membership) {}

  async deleteOne(id) {
    const membershipData = await Memberships.destroy(id)

    return membershipData
  }
}

export default new MembershipService();