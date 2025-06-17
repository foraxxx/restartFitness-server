import ApiError from "../exceptions/apiErrors.js";
import newsService from "../service/newsService.js";
import {Statuses} from "../models/index.js"
import { Op } from 'sequelize';

class statusController {
  async getAllForMemberships(req, res, next) {
    try {
      const statuses = await Statuses.findAll({
        where: {
          [Op.or]: [
            { name: 'Активный' },
            { name: 'Завершён' }
          ]
        }
      });

      return res.json(statuses);

    } catch(error) {
      next(error)
    }

  }
}

export default new statusController();
