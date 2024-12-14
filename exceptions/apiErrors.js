export default class ApiError extends Error {
  status
  errors

  constructor(status, message, errors = []) {
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

  static NotFound(message = 'Ресурс не найден') {
    return new ApiError(404, message)
  }

  static Forbidden() {
    return new ApiError(403, 'Нет доступа')
  }
}