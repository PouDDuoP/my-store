
class UsersService {

  constructor() {
    this.limit = 10;
    this.offset = 100;
  }

  create() {

  }

  find() {
    return this.users;
  }

  findOne(id) {
    return this.users.find(item => item.id === id)
  }

  update() {

  }

  delete() {

  }

}

module.exports = UsersService
