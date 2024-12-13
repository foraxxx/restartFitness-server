import { Roles } from "../models/index.js"
import RoleService from "../service/roleService.js"
import ApiError from "../exceptions/apiErrors.js"

class RoleController {
  async create (req, res, next) {
    try {
      let { name } = req.body

      if (!name) {
        return next(ApiError.BadRequest('Укажите название роли'))
      }

      name = (name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()).trim()

      const roleData = await RoleService.create(name)

      return res.json({...roleData.toJSON(), message: `Роль ${roleData.name} успешно создана`})
    } catch(error) {
      return next(error)
    }
  }

  async getAll (req, res, next) {
    try {
      const roles = await RoleService.getAll()

      return res.json(roles)
    } catch(error) {
      return next(error)
    }
  }

  async delete (req, res, next) {
    try {
      const { id } = req.params

      const role = await Roles.findByPk(id)

      if (!role) {
        return next(ApiError.BadRequest(`Роли не существует`))
      }

      const roleData = await RoleService.delete(id)

      return res.json({...roleData.toJSON(), message: `Роль ${roleData.name} успешно удалена`})
    } catch(error) {
        return next(error)
    }
  }
}

export default new RoleController()