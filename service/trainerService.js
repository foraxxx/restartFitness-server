import {Trainers} from "../models/index.js"
import ApiError from "../exceptions/apiErrors.js"

class TrainerService {
  async getOne(id) {
    const trainerData = await Trainers.findOne({where: {UserId: id}})
    console.log(trainerData)

    return trainerData
  }

  async update(trainerData) {
    const {id, bio, experience, vkLink, photo} = trainerData
    const trainer = await Trainers.findOne({where: {UserId: id}})
    trainer.bio = bio
    trainer.experience = experience
    trainer.vkLink = vkLink
    trainer.photo = photo
    await trainer.save()

    return trainer
  }

  async create(id, trainerData) {
    const {bio, experience, vkLink, photo} = trainerData

    const trainer = await Trainers.create({UserId: id, bio, experience, vkLink, photo})

    return trainer
  }

  async delete(id) {
    const trainerData = await Trainers.findOne({where: {UserId: id}})
    await Trainers.destroy({where: {UserId: id}})

    return trainerData
  }
}

export default new TrainerService()