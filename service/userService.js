import {Roles, Users} from "../models/index.js"
import TokenService from "./tokenService.js"
import UserDTO from "../dto/userDTO.js"

class UserService {
  async registration(name, surName, number) {
    const candidate = await Users.findOne({where: {number}})

    if (candidate) {
      throw new Error(`Пользователь с таким номером уже существует`)
    }

    const defaultRole = await Roles.findOne({where: {name: 'Пользователь'}})
    const user = await Users.create({name, surName, number, RoleId: defaultRole.id})
    const userDTO = new UserDTO({id: user.id, number: user.number, role: defaultRole.name})

    const tokens = TokenService.generateTokens({...userDTO})
    await TokenService.saveToken(userDTO.id, tokens.refreshToken)

    return {...tokens, user: userDTO}
  }

  async login(username, password) {

  }

}

export default new UserService()