import ApiError from "../exceptions/apiErrors.js"
import ReviewsService from "../service/reviewsService.js"


class ReviewsController {
  async create(req, res, next) {
    const {description, rating, isAnonymous = false} = req.body
    const {user} = req
    const date = new Date()
    date.toISOString()

    if (!description || !rating) {
      return next(ApiError.BadRequest('Не все поля заполнены'))
    }

    const reviewData = await ReviewsService.create({UserId: user.id, description, rating, isAnonymous, date})

    return res.json({...reviewData.toJSON(), message: 'Отзыв успешно создан'})
  }

  async getAll(req, res, next) {
    const reviewsData = await ReviewsService.getAll()

    return res.json(reviewsData)
  }
}

export default new ReviewsController()