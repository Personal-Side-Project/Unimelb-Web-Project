const express = require('express')

// add router
const orderRouter = express.Router()

// require the order controller
const orderController = require('../controllers/orderController.js')

// handle the GET request to show orders
orderRouter.get('/', orderController.getAllOrders)

// handle the POST request to update orders
orderRouter.post('/:id/update', orderController.updateOrder)

// export the router
module.exports = orderRouter