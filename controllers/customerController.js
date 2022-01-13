const bcrypt = require('bcryptjs');
var Customer = require('../models/customers');
/**
 * This function let customers register a new account (POST)
 */
exports.customerRegisterPost = function (req, res) {
    const { givenName, familyName, email, password } = req.body;
    // Check if email already exist in our database
    Customer.findOne({ email: email }).then((customer) => {
        if (customer) {
            res.status(409).json({ error: 'The email is already taken!'});
        } else {
            const newCustomer = new Customer({
                givenName,
                familyName,
                email,
                password,
            });
            // Encrypt the password by hashing
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newCustomer.password, salt, (err, hash) =>{
                    if (err) throw err;
                    newCustomer.password = hash;
                    newCustomer.save().then((customer) => {
                        res.json({
                            customer: {
                                id: customer.id,
                                giveName: customer.givenName,
                                familyName: customer.familyName,
                                email: customer.email,
                                password: customer.password
                            },
                        });
                    });
                });
            });
        }
    });    
};
/**
 * This function let customers login with their registered email and password (POST)
 */
exports.login = function (req, res) {
    const { email, password } = req.body;
    // Locate the customer by email
    Customer.findOne ({
        email: email,
    }).then((customer) => {
        if (!customer) {
            res.status(404).json({ success: false, error: 'Invalid Account' });
        } else {
            // Check password indentity
            bcrypt.compare(password, customer.password, (err, isMatch) =>{
                if (isMatch) {
                    res.status(200).json({
                        success: true,
                        customer: {
                            id: customer.id,
                            givenName: customer.givenName,
                            familyName: customer.familyName,
                            email: customer.email,
                            location: customer.location
                        },
                    });
                } else {
                    res.status(409).json({ error: err, message: 'Incorrect Password' });
                }
            }) 
        }
    })
};
/**
 * Request to update customer name (POST) 
 */
exports.customerNameUpdate = function (req, res) {
    // Locate the customer by id
    Customer.findById(req.params.id).then((customer) => {
        if(!customer) {
          res.status(409).json('Customer not found in database');
        } else {
            Customer.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true },
                function (err, updatedCustomer) {
                    if(err) {
                        res.status(404).json({ success: false, err});
                    } else {
                        res.status(200).json({ success: true, updatedCustomer: updatedCustomer});
                    }
                }
            )
        }
    })
};
/**
 * Request to update customer password (POST) 
 */
exports.customerPasswordUpdate = function (req, res) {
    // Locate the customer by id
    Customer.findById(req.params.id).then((customer) => {
        if(!customer) {
            res.status(409).json('Customer not found in database');
        } else {
            // Encrypt the new password
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(req.body.password, salt, (err, hash) =>{
                    if (err) throw err;
                    req.body.password = hash;
                    Customer.findByIdAndUpdate(
                        req.params.id,
                        req.body,
                        { new: true },
                        function (err, updatedCustomer) {
                            if(err) {
                                res.status(404).json({ success: false, err});
                            } else {
                                res.status(200).json({ success: true, updatedCustomer: updatedCustomer});
                            }
                        }
                    )
                });               
            });
          }        
    })
};
