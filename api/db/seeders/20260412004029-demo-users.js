'use strict';
const { USER_TABLE } = require('./../models/user.model');
const bcrypt = require('bcrypt');
const { faker } = require('@faker-js/faker/locale/es'); // Datos en español

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const hash = await bcrypt.hash('password123', 10);

    await queryInterface.bulkInsert(USER_TABLE, [
      // Admin user
      {
        username: 'admin',
        email: 'admin@mystore.com',
        first_name: 'Admin',
        last_name: 'User',
        password: hash,
        profile: 'admin',
        create_at: new Date(),
        is_superuser: true,
        is_active: true,
      },
      // Tier users (2)
      {
        username: 'tier1',
        email: 'tier1@mystore.com',
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        password: hash,
        profile: 'tier',
        create_at: new Date(),
        is_superuser: false,
        is_active: true,
      },
      {
        username: 'tier2',
        email: 'tier2@mystore.com',
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        password: hash,
        profile: 'tier',
        create_at: new Date(),
        is_superuser: false,
        is_active: true,
      },
      // Customer users (3)
      {
        username: 'customer1',
        email: 'customer1@mystore.com',
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        password: hash,
        profile: 'customer',
        create_at: new Date(),
        is_superuser: false,
        is_active: true,
      },
      {
        username: 'customer2',
        email: 'customer2@mystore.com',
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        password: hash,
        profile: 'customer',
        create_at: new Date(),
        is_superuser: false,
        is_active: true,
      },
      {
        username: 'customer3',
        email: 'customer3@mystore.com',
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        password: hash,
        profile: 'customer',
        create_at: new Date(),
        is_superuser: false,
        is_active: true,
      }
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete(USER_TABLE, null, {});
  }
};
