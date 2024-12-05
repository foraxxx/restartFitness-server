import {Model as User} from "sequelize"
import UserService from "../service/userService.js"

class UserController {
  async registration(req, res) {
    try {
      const {name, surName, number} = req.body
      const newName = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()
      const newSurName = surName.charAt(0).toUpperCase() + surName.slice(1).toLowerCase()

      const userData = await UserService.registration(newName, newSurName, number)

      res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
      return res.json(userData)
    } catch(error) {
      return res.status(400).json({message: error.message})
    }
  }

  async login(req, res) {
    try {

    } catch(error) {

    }
  }

  async logout(req, res) {
    try {

    } catch(error) {

    }
  }

  async refresh(req, res) {
    try {

    } catch(error) {

    }
  }
}

export default new UserController()