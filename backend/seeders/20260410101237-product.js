'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    const products = [
      {
        name: 'Samsung Galaxy S24 Ultra',
        slug: 'samsung-galaxy-s24-ultra',
        description: 'Flagship Android phone with premium camera and display.',
        price: 119999,
      },
      {
        name: 'Apple iPhone 15 Pro',
        slug: 'apple-iphone-15-pro',
        description: 'High-end iOS smartphone for creators and power users.',
        price: 129999,
      },
      {
        name: 'OnePlus 12 5G',
        slug: 'oneplus-12-5g',
        description: 'Fast and smooth 5G Android phone with flagship specs.',
        price: 69999,
      },
      {
        name: 'Anker 20000mAh Power Bank',
        slug: 'anker-20000mah-power-bank',
        description: 'High-capacity power bank with fast charging output.',
        price: 4999,
      },
      {
        name: 'Spigen Rugged Armor Case',
        slug: 'spigen-rugged-armor-case',
        description: 'Shockproof phone case for everyday protection.',
        price: 1499,
      },
      {
        name: 'Belkin 30W USB-C Charger',
        slug: 'belkin-30w-usb-c-charger',
        description: 'Compact fast charger compatible with phones and tablets.',
        price: 2499,
      },
    ];

    await queryInterface.bulkInsert(
      'products',
      products.map((product) => ({
        ...product,
        createdAt: now,
        updatedAt: now,
      })),
      {},
    );

    const productRows = await queryInterface.sequelize.query(
      `SELECT id, slug FROM products WHERE slug IN (:productSlugs)`,
      {
        replacements: {
          productSlugs: products.map((product) => product.slug),
        },
        type: Sequelize.QueryTypes.SELECT,
      },
    );

    const categorySlugs = [
      'smartphones',
      'android-phones',
      'ios-phones',
      '5g-smartphones',
      'gaming-smartphones',
      'camera-phones',
      'phone-cases',
      'chargers-cables',
      'wireless-chargers',
      'cables-adapters',
      'screen-protectors',
      'power-banks',
      'mobile-photography',
    ];

    const categoryRows = await queryInterface.sequelize.query(
      `SELECT id, slug FROM categories WHERE slug IN (:categorySlugs)`,
      {
        replacements: { categorySlugs },
        type: Sequelize.QueryTypes.SELECT,
      },
    );

    const productBySlug = Object.fromEntries(
      productRows.map((row) => [row.slug, row.id]),
    );
    const categoryBySlug = Object.fromEntries(
      categoryRows.map((row) => [row.slug, row.id]),
    );

    const productCategoryMap = {
      'samsung-galaxy-s24-ultra': [
        'smartphones',
        'android-phones',
        '5g-smartphones',
        'camera-phones',
        'gaming-smartphones',
      ],
      'apple-iphone-15-pro': [
        'smartphones',
        'ios-phones',
        '5g-smartphones',
        'camera-phones',
        'mobile-photography',
      ],
      'oneplus-12-5g': [
        'smartphones',
        'android-phones',
        '5g-smartphones',
        'gaming-smartphones',
      ],
      'anker-20000mah-power-bank': ['power-banks', 'chargers-cables'],
      'spigen-rugged-armor-case': ['phone-cases', 'screen-protectors'],
      'belkin-30w-usb-c-charger': [
        'chargers-cables',
        'wireless-chargers',
        'cables-adapters',
      ],
    };

    const productHasCategories = [];

    for (const [productSlug, slugs] of Object.entries(productCategoryMap)) {
      const productId = productBySlug[productSlug];

      if (!productId) {
        continue;
      }

      for (const categorySlug of slugs) {
        const categoryId = categoryBySlug[categorySlug];

        if (!categoryId) {
          continue;
        }

        productHasCategories.push({
          productId,
          categoryId,
          createdAt: now,
          updatedAt: now,
        });
      }
    }

    if (productHasCategories.length) {
      await queryInterface.bulkInsert(
        'productHasCategories',
        productHasCategories,
        {},
      );
    }

    const productHasMedias = productRows.map((row) => ({
      productId: row.id,
      path: 'upload/image.png',
      filename: 'image.png',
      type: 'image',
      size: 102400,
      createdBy: 1,
      createdAt: now,
      updatedAt: now,
    }));

    if (productHasMedias.length) {
      await queryInterface.bulkInsert('produtHasMedias', productHasMedias, {});
    }
  },

  async down(queryInterface, Sequelize) {
    const productSlugs = [
      'samsung-galaxy-s24-ultra',
      'apple-iphone-15-pro',
      'oneplus-12-5g',
      'anker-20000mah-power-bank',
      'spigen-rugged-armor-case',
      'belkin-30w-usb-c-charger',
    ];

    const productRows = await queryInterface.sequelize.query(
      `SELECT id FROM products WHERE slug IN (:productSlugs)`,
      {
        replacements: { productSlugs },
        type: Sequelize.QueryTypes.SELECT,
      },
    );

    const productIds = productRows.map((row) => row.id);

    if (productIds.length) {
      await queryInterface.bulkDelete(
        'produtHasMedias',
        {
          productId: {
            [Sequelize.Op.in]: productIds,
          },
          path: 'upload/image.png',
        },
        {},
      );

      await queryInterface.bulkDelete(
        'productHasCategories',
        {
          productId: {
            [Sequelize.Op.in]: productIds,
          },
        },
        {},
      );
    }

    await queryInterface.bulkDelete(
      'products',
      {
        slug: {
          [Sequelize.Op.in]: productSlugs,
        },
      },
      {},
    );
  },
};
