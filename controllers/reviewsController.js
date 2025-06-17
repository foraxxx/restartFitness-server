import ApiError from "../exceptions/apiErrors.js"
import ReviewsService from "../service/reviewsService.js"


class ReviewsController {
  async create(req, res, next) {
    try {
      const { description, rating, isAnonymous } = req.body;
      const userId = req.user.id;
      const review = await ReviewsService.create({ description, rating, isAnonymous, UserId: userId });
      return res.json(review);
    } catch (error) {
      next(error)
    }
  }

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const review = await ReviewsService.update(id, status);
      return res.json(review);
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      const deletedReview = await ReviewsService.delete(id);
      return res.json(deletedReview);
    } catch (error) {
      next(error)
    }
  }

  async getAll(req, res, next) {
    try {
      const reviews = await ReviewsService.getAll();
      return res.json(reviews);
    } catch(error) {
        next(error)
    }
  }

}

export default new ReviewsController()