const express = require('express')

// add router
const customerRouter = express.Router()

// require the snack controller
const snackController = require('../controllers/snackController.js')

// require the order controller
const orderController = require('../controllers/orderController.js')

// require the customer controller
const customerController = require('../controllers/customerController.js')

// handle the POST request to register for a new customer
customerRouter.post('/register', customerController.customerRegisterPost)

// handle the POST request to log in
customerRouter.post('/login', customerController.login)

// handle the GET request to get all Snacks displayed as a menu
customerRouter.get('/menu', snackController.getAllSnacks)

// handle the POST request to add one order
customerRouter.post('/addOrder', orderController.addOrder)

// handle the POST request to update Customer name
customerRouter.post('/:id/nameUpdate', customerController.customerNameUpdate)

// handle the POST request to update Customer password
customerRouter.post('/:id/passwordUpdate', customerController.customerPasswordUpdate)

// export the router
module.exports = customerRouter