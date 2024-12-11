import {Roles, Users} from "../models/index.js"
import TokenService from "./tokenService.js"
import UserDTO from "../dto/userDTO.js"
import {Tokens} from "../models/models.js"
import ApiError from "../exceptions/apiErrors.js"
import TrainerService from "./trainerService.js"

class UserService {
  async registration(name, surName, number) {
    const candidate = await Users.findOne({where: {number}})

    if (candidate) {
      throw ApiError.BadRequest('Пользователь с таким номером уже существует')
    }

    const defaultRole = await Roles.findOne({where: {name: 'Пользователь'}})
    const user = await Users.create({name, surName, number, RoleId: defaultRole.id})
    const userDTO = new UserDTO({id: user.id, number: user.number, role: defaultRole.name})

    const tokens = TokenService.generateTokens({...userDTO})
    await TokenService.saveToken(userDTO.id, tokens.refreshToken)

    return {...tokens, user: userDTO}
  }

  async login(number, oldRefreshToken) {
    const user = await Users.findOne({where: {number}})

    if (!user) {
      throw ApiError.NotFound(`Пользователя с таким номером не существует`)
    }

    const role = await Roles.findOne({where: {id: user.RoleId}})
    const userDTO = new UserDTO({id: user.id, number: user.number, role: role.name})

    const tokens = TokenService.generateTokens({...userDTO})
    await TokenService.saveToken(userDTO.id, tokens.refreshToken, oldRefreshToken)

    return {...tokens, user: userDTO}
  }

  async logout(refreshToken) {
    const token = await TokenService.destroyToken(refreshToken)

    return token
  }

  async refresh(oldRefreshToken) {
    if (!oldRefreshToken) {
      throw ApiError.UnauthorizedError()
    }

    const userData = TokenService.validateRefreshToken(oldRefreshToken)
    const token = await TokenService.findToken(oldRefreshToken)

    if (!userData || !token) {
      throw ApiError.UnauthorizedError()
    }

    const user = await Users.findByPk(userData.id)
    const role = await Roles.findByPk(user.RoleId)
    const userDTO = new UserDTO({id: user.id, number: user.number, role: role.name})

    const tokens = TokenService.generateTokens({...userDTO})
    await TokenService.saveToken(userDTO.id, tokens.refreshToken, oldRefreshToken)

    return {...tokens, user: userDTO}
  }

  async getUsers() {
    const users = await Users.findAll()

    return users
  }

  async getOne(id) {
    const userData = await Users.findByPk(id)

    if (!userData) {
      throw ApiError.NotFound('Пользователь не найден')
    }

    const roleData = await Roles.findByPk(userData.RoleId)

    return {userData, roleData}
  }

  async updateRole(idUser, idRole) {
    const user = await Users.findByPk(idUser)
    user.RoleId = idRole
    await user.save()

    return user
  }
}

export default new UserService()