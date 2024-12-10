export default class ApiError extends Error {
  status
  errors

  constructor(message, status, errors = []) {
    super(message)
    this.status = status
    this.errors = errors
  }

  static UnauthorizedError() {
    return new ApiError(401, 'Пользователь не авторизирован')
  }

  static BadRequest(message, errors) {
    return new ApiError(400, message, errors)
  }
}