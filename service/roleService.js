import {Roles} from "../models/index.js"
import ApiError from "../exceptions/apiErrors.js"

class RoleService {
  async create(name) {
    const role = await Roles.findOne({where: {name}})

    if (role) {
      throw ApiError.BadRequest(`Роль ${name} уже существует`)
    }

    const newRole = await Roles.create({name})

    return newRole
  }

  async getAll () {
    const rolesData = await Roles.findAll()

    return rolesData
  }

  async getOne(id) {
    const roleData = Roles.findByPk(id)

    return roleData
  }

  async delete(id) {
    const role = await Roles.findByPk(id)
    await Roles.destroy({where: {id}})

    return role
  }
}

export default new RoleService()