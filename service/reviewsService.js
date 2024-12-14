import {Reviews, Users} from "../models/index.js"

class ReviewsService {
  async create(review) {
    const newReview = await Reviews.create(review)
    const reviewData = await Reviews.findByPk(newReview.id, {include: {model: Users}})

    return reviewData
  }

  async getAll() {
    const reviewsData = await Reviews.findAll({include: {model: Users}})

    return reviewsData
  }
}

export default new ReviewsService()