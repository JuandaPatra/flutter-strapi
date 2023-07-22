"use strict";

/**
 * payment-callback controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::payment-callback.payment-callback",
  ({ strapi }) => ({
    async create(ctx) {
      let request = ctx.request.body;
      // console.log(request.order_id)
      // let order = await strapi.service("api::order.order").findOne(request.data.history.order_id);
      let order = await strapi.service("api::payment-callback.payment-callback").create({
        'data' :{'history' : request}});

      let params = {};

      if (request.transaction_status == "settlement") {
        params = {
          'data': { 'orderStatus': "purchased" },
        };
      } else {
        let data = { 'orderStatus': "cancel" };
        params = {
          'data': { 'orderStatus': "cancel" },
        };
      }

      let updateOrder = await strapi.service("api::order.order").update(request.order_id, params);
      return 'success';
    },
  })
);
