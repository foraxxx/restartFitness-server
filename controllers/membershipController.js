import MembershipService from "../service/membershipService.js"
import { v4 as uuidv4 } from "uuid"
import path from "path"
import ApiError from "../exceptions/apiErrors.js"
import fs from "fs"
import {Memberships} from "../models/index.js"

class MembershipController {
  async createOne(req, res, next) {
    try {
      const {name, description, durationDays, isFreezing = false, freezingDays = 0, price, StatusId, MembershipTypeId} = req.body
      const {photo} = req.files
      let filename = uuidv4() + ".jpg"

      const membershipData = await MembershipService.create({name, description, durationDays, photo: filename, isFreezing, freezingDays, price, StatusId, MembershipTypeId})

      if (membershipData) {
        await photo.mv(path.resolve(process.cwd(), 'static/memberships', filename));
      }

      return res.json({...membershipData.toJSON(), message: 'Абонемент успешно создан'})
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
      const {id} = req.params
      const {name, description, durationDays, isFreezing = false, freezingDays = 0, price, statusId, membershipTypeId} = req.body
      const {photo} = req.files || {}
      let filename = uuidv4() + ".jpg"

      const oldMembershipData = await Memberships.findByPk(id)
      const updatedMembershipData = await MembershipService.updateOne(
        {
          id,
          name,
          description,
          durationDays,
          isFreezing,
          freezingDays,
          price,
          statusId,
          membershipTypeId,
          photo:filename
        })

      if (updatedMembershipData) {
        if (photo) {
          const oldPhotoPath = path.resolve(process.cwd(), 'static/memberships', oldMembershipData.photo)
          if (fs.existsSync(oldPhotoPath)) {
            fs.unlinkSync(oldPhotoPath)
          }
        }

        await photo.mv(path.resolve(process.cwd(), 'static/memberships', filename))
      }

      return res.json({...updatedMembershipData.toJSON(), message: 'Абонемент успешно обновлён'})
    } catch(error) {
      next(error)
    }
  }

  async deleteOne(req, res, next) {
    try {
      const {id} = req.params

      const membershipData = await MembershipService.deleteOne(id)

      const photoPath = path.resolve(process.cwd(), 'static/memberships', membershipData.photo)

      if (fs.existsSync(photoPath)) {
        fs.unlinkSync(photoPath)
      }

      return res.json({membershipData, message: 'Абонемент успешно удалён'})
    } catch(error) {
      next(error)
    }
  }
}

export default new MembershipController()