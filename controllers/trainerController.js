import ApiError from "../exceptions/apiErrors.js"
import {v4 as uuidv4} from "uuid"
import TrainerService from "../service/trainerService.js"
import path from "path"
import fs from "fs"

class TrainerController {
  async createOne(req, res, next) {
    try {
      const { id } = req.params
      const {bio, experience, vkLink} = req.body
      const {photo} = req.files || {}

      if (!bio || !experience || !vkLink || !photo) {
        return next(ApiError.BadRequest('Не все поля заполнены'))
      }

      const trainerData = await TrainerService.getOne(id)

      if (trainerData) {
        const updatedTrainerData = await this.updateOne(req, res, next)

        return updatedTrainerData
      }

      let filename = uuidv4() + ".jpg"
      const createdTrainerData = await TrainerService.create(id, {bio, experience, vkLink, photo: filename})
      await photo.mv(path.resolve(process.cwd(), 'static/trainers', filename))

      return createdTrainerData
    } catch(error) {
      next(error)
    }
  }

  async updateOne(req, res, next) {
    try {
      const { id } = req.params
      const {bio, experience, vkLink} = req.body
      const {photo} = req.files || {}
      let filename = uuidv4() + ".jpg"

      const oldTrainerData = await TrainerService.getOne(id)
      const updatedTrainerData = await TrainerService.update({id, bio, experience, vkLink, photo: filename})

      if (updatedTrainerData) {
        if (photo) {
          const oldPhotoPath = path.resolve(process.cwd(), 'static/trainers', oldTrainerData.photo)
          if (fs.existsSync(oldPhotoPath)) {
            fs.unlinkSync(oldPhotoPath)
          }
        }

        await photo.mv(path.resolve(process.cwd(), 'static/trainers', filename))
      }

      return updatedTrainerData
    } catch(error) {
      next(error)
    }

  }

  async getOne(req, res, next) {
    try {
      const {id} = req.params

      const trainerData = await TrainerService.getOne(id)

      if (!trainerData) {
        return next(ApiError.NotFound())
      }

      res.json(trainerData)
    } catch(error) {
      next(error)
    }
  }

  async getAll(req, res, next) {
    const trainersData = await TrainerService.getAll()

    res.json(trainersData)
  }
}

export default new TrainerController()