import {Roles, Trainers, Users} from "../models/index.js"
import ApiError from "../exceptions/apiErrors.js"

class TrainerService {
  async getOne(id) {
    const trainerData = await Trainers.findByPk(id, {include: {model: Users}})

    return trainerData
  }

  async getAll () {
    const trainersData = await Trainers.findAll({include: {model: Users}})

    return trainersData
  }

  async update(trainerData) {
    const {id} = trainerData
    const trainer = await Trainers.findOne({where: {UserId: id}})

    Object.assign(trainer, trainerData)
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