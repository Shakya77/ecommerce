'use strict';

const bcrypt = require('bcryptjs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash('password', saltRounds);

    const users = [
      {
        name: 'Admin User',
        slug: 'admin-user',
        email: 'admin@gmail.com',
        password: passwordHash,
        role: 'admin',
        isActive: true,
      },
      {
        name: 'Demo User',
        slug: 'demo-user',
        email: 'user@gmail.com',
        password: passwordHash,
        role: 'customer',
        isActive: true,
      },
    ];

    await queryInterface.bulkInsert('users', users, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete(
      'users',
      {
        email: {
          [Sequelize.Op.in]: ['admin@gmail.com', 'user@gmail.com'],
        },
      },
      {},
    );
  },
};
