import {Trainers} from "../models/index.js"

class TrainerService {
  async getOne(id) {
    const TrainerData = await Trainers.findOne({where: {UserId: id}})

    return TrainerData
  }

  async update(userId, trainerData) {
    const {bio, experience, vkLink, photo} = trainerData
    const trainer = await Trainers.findOne({where: {UserId: userId}})
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