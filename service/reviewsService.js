import { Reviews, Users, Statuses } from '../models/index.js';

class ReviewsService {
  async create({ description, rating, isAnonymous, UserId }) {

    const status = await Statuses.findOne({where: {name: "На проверке"}})
    return await Reviews.create({
      description,
      rating,
      isAnonymous,
      StatusId: status.id,
      UserId
    });
  }

  async update(id, statusName) {
    const review = await Reviews.findByPk(id);
    if (!review) {
      throw new Error("Отзыв не найден");
    }

    const status = await Statuses.findOne({ where: { name: statusName } });
    if (!status) {
      throw new Error(`Статус "${statusName}" не найден`);
    }

    await review.update({ StatusId: status.id });

    return await Reviews.findByPk(id, {
      include: ['Status', 'User']
    });
  }


  async delete(id) {
    const review = await Reviews.findByPk(id);
    if (!review) {
      throw new Error('Отзыв не найден');
    }
    await review.destroy();
    return { message: 'Отзыв удалён' };
  }

  async getAll() {
    return await Reviews.findAll({
      include: [
        { model: Users, attributes: ['id', 'name', 'surName'], as: 'User' },
        { model: Statuses, attributes: ['id', 'name'], as: 'Status' }
      ],
      order: [['createdAt', 'DESC']]
    });
  }
}

export default new ReviewsService();
