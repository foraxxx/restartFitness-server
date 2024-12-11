import {Memberships, MembershipTypes, Statuses} from "../models/index.js"

class MembershipService {
  async create(membership) {
    const membershipData = await Memberships.create(membership, {include: [{model: MembershipTypes}, {model: Statuses}]})

    const fullMembershipData = await Memberships.findOne({
      where: { id: membershipData.id },
      include: [{ model: MembershipTypes}, { model: Statuses}]
    });

    return fullMembershipData
  }

  async getAll() {
    const membershipsData = await Memberships.findAll({include: [{model: MembershipTypes}, {model: Statuses}]})

    return membershipsData
  }

  async getOne(id) {
    const membershipData = await Memberships.findOne({where: {id}, include: [{model: MembershipTypes}, {model: Statuses}]})

    return membershipData
  }

  async updateOne(id, membership) {}

  async deleteOne(id) {
    const membershipData = await Memberships.destroy({where: {id}})

    return membershipData
  }
}

export default new MembershipService();