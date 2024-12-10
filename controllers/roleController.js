import { Roles } from "../models/index.js"

class RoleController {
  async create (req, res) {
    try {
      const { name } = req.body

      if (!name) {
        return res.status(400).send({message: 'Укажите название роли'})
      }

      const editName = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()

      const role = await Roles.findOne({where: {name: editName}})

      if (role) {
        return res.status(400).json({message: `Роль ${editName} уже существует`})
      }

      const newRole = await Roles.create({name: editName})

      return res.json({newRole, message: `Роль ${editName} успешно создана`})
    } catch(error) {
      console.log(error)
      return res.json({error})
    }
  }

  async getAllRoles (req, res) {
    try {
      const roles = await Roles.findAll()

      return res.json(roles)
    } catch(error) {
      return res.status(500).json({message: 'Ошибка при получении списка ролей'})
    }
  }

  async delete (req, res) {
    try {
      const { id } = req.params

      const role = await Roles.findOne({where: {id}})
      const deletedRole = await Roles.destroy({where: {id}})

      if (deletedRole) {
        return res.json({role, message: `Роль ${role.name} успешно удалена`})
      } else {
        return res.status(500).json({message: 'Ошибка при удалении роли'})
      }
    } catch(error) {
        return res.status(500).json({message: 'Ошибка при удалении роли'})
    }
  }
}

export default new RoleController()