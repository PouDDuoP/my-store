
class CategoriesService {

  constructor() {
    this.categories = [
      {
        id: "1",
        name: 'Category One'
      },
      {
        id: "2",
        name: 'Category Two'
      }
    ]
  }

  create() {

  }

  find() {
    return this.categories;
  }

  findOne(id) {
    return this.categories.find(item => item.id === id)
  }

  update() {

  }

  delete() {

  }

}

module.exports = CategoriesService;
