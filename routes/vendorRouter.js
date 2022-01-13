const express = require('express')

// add router
const vendorRouter = express.Router()

// require the vendor controller
const vendorController = require('../controllers/vendorController.js')

// require the order controller
const orderController = require('../controllers/orderController.js')

// handle the GET request for the five opened nearest vendors
vendorRouter.get('/', vendorController.vendorFiveGet);

// handle the POST request to register a new vendor
vendorRouter.post('/register', vendorController.vendorRegisterPost);

// handle the POST request to login
vendorRouter.post('/login', vendorController.vendorLoginPost);

// handle the POST request to park vendors
vendorRouter.post('/park/:id', vendorController.vendorParkPost);

// handle the POST request to update the van status 
vendorRouter.post('/:id/update', vendorController.updateVendor);

// export the router
module.exports = vendorRouter