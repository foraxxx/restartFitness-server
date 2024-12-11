import MembershipService from "../service/membershipService.js"
import { v4 as uuidv4 } from "uuid"
import path from "path"
import ApiError from "../exceptions/apiErrors.js"

class MembershipController {
  async createOne(req, res, next) {
    try {
      const {name, description, durationDays, isFreezing, freezingDays = 0, price, StatusId, MembershipTypeId} = req.body
      const {photo} = req.files
      let filename = uuidv4() + ".jpg"

      const membershipData = await MembershipService.create({name, description, durationDays, photo: filename, isFreezing, freezingDays, price, StatusId, MembershipTypeId})

      if (membershipData) {
        photo.mv(path.resolve(process.cwd(), 'static/memberships', filename));
      }

      return res.json(membershipData)
    } catch(error) {
      next(ApiError.BadRequest(error.message))
    }
  }

  async getAll(req, res, next) {
    const membershipsData = await MembershipService.getAll()

    return res.json(membershipsData)
  }

  async getOne(req, res, next) {
    try {
      const {id} = req.params

      const membership = await MembershipService.getOne(id)

      return res.json(membership)
    } catch(error) {
      next(error)
    }
  }

  async updateOne(req, res, next) {
    try {
      // const {id} = req.params
      //
      // const membership = await MembershipService.updateOne(id)
      //
      // return res.json(membership)
    } catch(error) {
      next(error)
    }
  }

  async deleteOne(req, res, next) {
    try {
      const {id} = req.params

      const membership = await MembershipService.deleteOne(id)

      return res.json(membership)
    } catch(error) {
      next(error)
    }
  }
}

export default new MembershipController();