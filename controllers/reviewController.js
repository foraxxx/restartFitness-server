

class ReviewController {
  async create(req, res) {
    try {
      const { description, rating, isAnonymous, StatusId } = req.body;
      const userId = req.user.id;
      const review = await ReviewService.create({ description, rating, isAnonymous, StatusId, UserId: userId });
      res.status(201).json(review);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Ошибка при создании отзыва' });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const { description, rating, isAnonymous, StatusId } = req.body;
      const review = await ReviewService.update(id, { description, rating, isAnonymous, StatusId });
      res.status(200).json(review);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Ошибка при обновлении отзыва' });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      await ReviewService.delete(id);
      res.status(204).send();
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Ошибка при удалении отзыва' });
    }
  }
}

module.exports = new ReviewController();
