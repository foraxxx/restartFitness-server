import {UserMemberships} from "../models/index.js"
import {Op} from "sequelize"
import {Visit} from "../models/models.js"
import ApiError from "../exceptions/apiErrors.js"

class VisitController {
  async create(req, res, next) {
    try {
      const { qrCode, type } = req.body;
      const now = new Date();

      const membership = await UserMemberships.findOne({
        where: {
          qrCode,
          dateStart: { [Op.lte]: now },
          dateEnd: { [Op.gte]: now },
        }
      });

      if (!membership) {
        return res.status(400).json({ error: "Абонемент не найден или неактивен" });
      }

      // Определяем границы текущего дня
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);

      // Проверка: был ли уже визит с таким типом сегодня
      const existingVisit = await Visit.findOne({
        where: {
          UserMembershipId: membership.id,
          type,
          createdAt: {
            [Op.between]: [startOfDay, endOfDay],
          }
        }
      });

      if (existingVisit) {
        // return res.status(400).json({ error: `Вы уже отмечались как "${type}" сегодня.` });
        return next(ApiError.BadRequest(`Вы уже отмечались как "${type}" сегодня.`))
      }

      // Создаем запись
      const visit = await Visit.create({
        UserId: membership.UserId,
        UserMembershipId: membership.id,
        type,
      });

      res.json({ message: `Отмечен ${type}`, visit });

    } catch (error) {
      next(error);
    }
  }
}

export default new VisitController()