import {Memberships, MembershipTypes, Statuses} from "../models/index.js"
import ApiError from "../exceptions/apiErrors.js"

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

  async getAllActive() {
    const membershipsData = await Memberships.findAll({
      include: [
        { model: MembershipTypes },
        { model: MembershipTypes },
        {
          model: Statuses,
          where: { name: 'Активный' },
        },
      ],
    })

    return membershipsData
  }

  async getOne(id) {
      const membershipData = await Memberships.findOne({where: {id}, include: [{model: MembershipTypes}, {model: Statuses}]})

      if (!membershipData) {
        throw ApiError.NotFound()
      }

      return membershipData
  }

  async updateOne(membershipData) {
    const {id, name, description, durationDays, isFreezing, freezingDays, price, statusId, membershipTypeId, photo} = membershipData

    const membership = await Memberships.findByPk(id)
    Object.assign(membership, membershipData)
    await membership.save()

    const updatedMembership = await Memberships.findByPk(id, {include: [{model: MembershipTypes}, {model: Statuses}]})

    return updatedMembership

  }

  async deleteOne(id) {
    const membership = await Memberships.findByPk(id)

    if (!membership) {
      throw ApiError.NotFound()
    }
    await Memberships.destroy({where: {id: membership.id}})

    return membership
  }
}

export default new MembershipService();