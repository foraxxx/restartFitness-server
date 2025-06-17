class UserDTO {
  id
  number
  role

  constructor(data) {
    this.id = data.id
    this.number = data.number
    this.role = data.role
    this.name = data.name
    this.surName = data.surName
  }
}

export default UserDTO