"use strict";

// const dotenv = require("dotenv");
// dotenv.config();
/**
 * order controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::order.order", ({ strapi }) => ({
  async create(ctx) {
    const result = await super.create(ctx);

    // console.log(ctx);
    // console.log(result);

    const midtransClient = require("midtrans-client");
    // Create Snap API instance
    let snap = new midtransClient.Snap({
      isProduction: false,
      serverKey: `${process.env.MIDTRANS_SERVER_KEY}`,
      clientKey: `${process.env.MIDTRANS_CLIENT_KEY}`,
    });

    let parameter = {
      transaction_details: {
        order_id: result.data.id,
        gross_amount: result.data.attributes.totalPrice,
      },
      credit_card: {
        secure: true,
      },
    };

    let response = await snap.createTransaction(parameter);
    return { response };
  },
}));
