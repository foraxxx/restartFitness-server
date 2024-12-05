class UserDTO {
  id
  number
  role

  constructor(data) {
    this.id = data.id
    this.number = data.number
    this.role = data.role
  }
}

export default UserDTO