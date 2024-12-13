import MembershipService from "../service/membershipService.js"
import ApiError from "../exceptions/apiErrors.js"
import UserMembershipsService from "../service/userMembershipsService.js"
import {Statuses} from "../models/index.js"

class UserMembershipsController {
  async create(req, res, next) {
    try {
      const {id: MembershipId} = req.params
      const {user} = req
      const membershipData = await MembershipService.getOne(MembershipId)

      if (membershipData.Status.name !== 'Активный') {
        return next(ApiError.BadRequest('Абонемент не найден'))
      }

      const status = await Statuses.findOne({where: {name: 'Активный'}})

      const {durationDays, name, freezingDays} = membershipData
      let now = new Date()
      now.setDate(now.getDate())
      const dateStart = now.toISOString().split('T')[0]
      now.setDate(now.getDate() + durationDays)
      const dateEnd = now.toISOString().split('T')[0]

      const userMemberhipData = await UserMembershipsService.create(
        {
          MembershipId,
          UserId: user.id,
          StatusId: status.id,
          dateStart, dateEnd,
          dateOrder: dateStart,
          freezingDays,
          name: membershipData.name
        })


      return res.json(userMemberhipData)

    } catch(error) {
      next(error)
    }
  }

  async gatOne(req, res, next) {
    try {

    } catch(error) {
      next(error)
    }
  }

  async getAll(req, res, next) {
    try {

    } catch(error) {
      next(error)
    }
  }
}

export default new UserMembershipsController()