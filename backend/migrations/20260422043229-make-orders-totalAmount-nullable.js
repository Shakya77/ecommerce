'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.changeColumn('orders', 'totalAmount', {
      type: Sequelize.INTEGER,
      allowNull: true, // 👈 make it nullable
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.changeColumn('orders', 'totalAmount', {
      type: Sequelize.INTEGER,
      allowNull: false, // 👈 make it required
    });
  },
};
