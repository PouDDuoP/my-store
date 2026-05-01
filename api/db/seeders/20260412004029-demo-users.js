'use strict';
const { USER_TABLE } = require('./../models/user.model');
const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const hash = await bcrypt.hash('password123', 10);

    await queryInterface.bulkInsert(USER_TABLE, [
      // Admin user
      {
        username: 'admin',
        email: 'admin@mystore.com',
        firstName: 'Admin',
        lastName: 'User',
        password: hash,
        profile: 'admin',
        createdAt: new Date(),
        isSuperuser: true,
        isActive: true,
      },
      // Tier users (2)
      {
        username: 'tier1',
        email: 'tier1@mystore.com',
        firstName: 'Tier',
        lastName: 'One',
        password: hash,
        profile: 'tier',
        createdAt: new Date(),
        isSuperuser: false,
        isActive: true,
      },
      {
        username: 'tier2',
        email: 'tier2@mystore.com',
        firstName: 'Tier',
        lastName: 'Two',
        password: hash,
        profile: 'tier',
        createdAt: new Date(),
        isSuperuser: false,
        isActive: true,
      },
      // Customer users (3)
      {
        username: 'customer1',
        email: 'customer1@mystore.com',
        firstName: 'Customer',
        lastName: 'One',
        password: hash,
        profile: 'customer',
        createdAt: new Date(),
        isSuperuser: false,
        isActive: true,
      },
      {
        username: 'customer2',
        email: 'customer2@mystore.com',
        firstName: 'Customer',
        lastName: 'Two',
        password: hash,
        profile: 'customer',
        createdAt: new Date(),
        isSuperuser: false,
        isActive: true,
      },
      {
        username: 'customer3',
        email: 'customer3@mystore.com',
        firstName: 'Customer',
        lastName: 'Three',
        password: hash,
        profile: 'customer',
        createdAt: new Date(),
        isSuperuser: false,
        isActive: true,
      }
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete(USER_TABLE, null, {});
  }
};
