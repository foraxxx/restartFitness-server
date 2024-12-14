import ApiError from "../exceptions/apiErrors.js"
import {Model as ReviewService} from "sequelize"

class ReviewsController {
  async create(req, res, next) {
    const {description, rating, isAnonymous = false} = req.body
    const {user} = req
    const date = new Date()
    date.toISOString()

    if (!description || !rating) {
      return next(ApiError.BadRequest('Не все поля заполнены'))
    }

    const reviewData = async ReviewService.create({UserId: user.id, description, rating, isAnonymous, date})

    return res.json(reviewData.toJSON())
  }

  async getAll(req, res, next) {
    const reviewsData = async ReviewService.getAll()

    return res.json(reviewsData.toJSON())
  }
}

export default new ReviewsController()