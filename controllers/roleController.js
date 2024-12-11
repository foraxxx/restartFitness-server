import { Roles } from "../models/index.js"
import RoleService from "../service/roleService.js"

class RoleController {
  async create (req, res, next) {
    try {
      let { name } = req.body
      name = (name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()).trim()

      if (!name) {
        return res.status(400).send({message: 'Укажите название роли'})
      }

      const role = await RoleService.create(name)

      return res.json({role, message: `Роль ${role.name} успешно создана`})
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

      const role = await RoleService.delete(id)

      return res.json({role, message: `Роль ${role.name} успешно удалена`})
    } catch(error) {
        return next(error)
    }
  }
}

export default new RoleController()