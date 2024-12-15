import UserService from "../service/userService.js"
import {Roles} from "../models/index.js"
import ApiError from "../exceptions/apiErrors.js"
import TrainerService from "../service/trainerService.js"
import path from "path"
import fs from "fs"
import TrainerController from "./trainerController.js"

class UserController {
  async registration(req, res, next) {
    try {
      const {name, surName, number} = req.body
      const newName = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()
      const newSurName = surName.charAt(0).toUpperCase() + surName.slice(1).toLowerCase()

      const userData = await UserService.registration(newName, newSurName, number)

      res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})

      return res.json(userData)
    } catch(error) {
      next(error)
    }
  }

  async login(req, res, next) {
    try {
      const { number } = req.body
      const { refreshToken } = req.cookies

      const userData = await UserService.login(number, refreshToken)
      res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})

      return res.json(userData)
    } catch(error) {
      next(error)
    }
  }

  async logout(req, res, next) {
    try {
      const { refreshToken } = req.cookies

      const token = UserService.logout(refreshToken)
      res.clearCookie('refreshToken')

      return res.json(token)
    } catch(error) {
      next(error)
    }
  }

  async refresh(req, res, next) {
    try {
      const { refreshToken } = req.cookies
      const userData = await UserService.refresh(refreshToken)
      res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})

      return res.json(userData)
    } catch(error) {
      next(error)
    }
  }

  async getUsers(req, res) {
    const users = await UserService.getUsers()

    return res.json(users)
  }

  async getOne(req, res, next) {
    try {
      const {id} = req.params

      const userData = await UserService.getOne(id)

      return res.json(userData)
    } catch(error) {
      next(error)
    }
  }

  async changeRole(req, res, next) {
    try {
      const {id} = req.params
      const {roleId} = req.body

      const userInfo = await UserService.getOne(id)

      if (!userInfo) {
        return next(ApiError.NotFound('Пользователь не найден'))
      }

      const roleData = await Roles.findByPk(roleId)

      if (roleData.name === 'Тренер') {
        const trainerData = await TrainerController.createOne(req, res, next)

        if (!trainerData) {
          return
        }

        const userData = await UserService.updateRole(id, roleData.id)

        return res.json({...userData.toJSON(), message: 'Пользователь успешно изменён'})
      }

      if (userInfo.Role.name === 'Тренер' && roleData.name !== 'Тренер') {
        const deletedTrainerData = await TrainerService.delete(id)
        const user = await UserService.updateRole(id, roleData.id)

        if (deletedTrainerData.photo) {
          const oldPhotoPath = path.resolve(process.cwd(), 'static/trainers', deletedTrainerData.photo)
          if (fs.existsSync(oldPhotoPath)) {
            fs.unlinkSync(oldPhotoPath)
          }
        }

        return res.json({...user.toJSON(), message: 'Пользователь успешно изменён'})
      }

      const userData = await UserService.updateRole(id, roleData.id)

      return res.json({...userData.toJSON(), message: 'Пользователь успешно изменён'})
    } catch(error) {
      next(error)
    }
  }
}

export default new UserController()