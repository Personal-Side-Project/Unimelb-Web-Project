const bcrypt = require('bcryptjs');
var Vendor = require('../models/vendors');
/**
 * Return five nearest opening vendors (GET)
 */
exports.vendorFiveGet = function (req, res) {
    const KILOMETER_TO_METER = 1000;
    // Get all vendors
    Vendor.find().exec((err, vendors) => {
        if (err) {
            res.status(404).json({ success: false, err: err })
        } else {
            // Filter only opened vendors
            var openedVendors = []
            var index = 0;
            for(var i = 0; i< vendors.length; i++) {
                if(vendors[i].status === "open") {
                    openedVendors[index] = vendors[i]
                    index++
                } 
            }
            // Calculate the distance between current customer and opened vendors
            var mapDistance = []
            for (i = 0; i< openedVendors.length; i++){
                var distance = Math.sqrt(Math.hypot(
                    req.query.lat - openedVendors[i].location.coordinates[0],
                    req.query.lng - openedVendors[i].location.coordinates[1]
            ))
            if(Number.isFinite(distance)) {
                mapDistance.push({
                    "id":vendors[i]._id,
                    "vendorName":vendors[i].vendorName,
                    "textAddress":vendors[i].textAddress,
                    "distance": (parseFloat(distance) * KILOMETER_TO_METER).toFixed(1),
                    "location": vendors[i].location.coordinates,
                    "status":vendors[i].status
                })
            }
          }
          // Output the five nearst opened vendors
          mapDistance = mapDistance.sort(({ distance: a }, { distance: b }) => a - b).slice(0, 5)
          res.status(200).json({ success: true, vendors: mapDistance})
        }
    })
};
/**
 * Vendor Register Function (POST)
 */
exports.vendorRegisterPost = function (req, res) {
    const { vendorName, password } = req.body;
    // Locate the vendor by vendor name
    Vendor.findOne({ vendorName: vendorName }).then((vendor) => {
        if (vendor) {
            res.status(409).json({ error: "Name has already existed!" });
        } else {
            const newVendor = new Vendor({
                vendorName, 
                password,
            });
            // Encrypt password by hashing
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newVendor.password, salt, (err, hash) => {
                    if (err) throw err;
                    newVendor.password = hash;
                    newVendor.save().then((vendor) => {
                        res.json({
                            vendor: {
                                id: vendor.id,
                                vendorName: vendor.vendorName,
                                password: vendor.password
                            },
                        });
                    });
                });
            });
        }  
  });
};
/**
 * Vendor Loging Function (POST)
 */
exports.vendorLoginPost = function (req, res) {
    const { vendorName, password } = req.body;
    // Locate vendor by name
    Vendor.findOne ({
        vendorName: vendorName,
    }).then((vendor) => {
        if (!vendor) {
            res.status(404).json({ success: false, error: 'Vendor not registered' });
        } else {
            // Check password indentity
            bcrypt.compare(password, vendor.password, (err, isMatch) => {
                if (isMatch) {
                    res.status(200).json({
                        success: true,
                        vendor: {
                            id: vendor.id,
                            vendorName: vendor.vendorName,
                            password: vendor.password
                        },
                    });
                } else {
                    res.status(409).json({ error: err, message: 'password incorrect'});
                }
            })
        }
    })
};
/**
 * Set up vendor location (POST)
 */
exports.vendorParkPost = function (req, res) {
    // Locate vendor by id
    Vendor.findById(req.params.id).then((vendor) => {
        if(!vendor) {
            res.status(409).json({
                error: 'Vendor not exist!'
            });
        } else {
            // Let the vendor upload parking location details
            Vendor.findByIdAndUpdate(
                req.params.id,
                {status: 'open', textAddress: req.body.textAddress, location: {type:"Point", coordinates: req.body.location } },
                {new: true},
                function (err, updatedVendor) {
                    if (err) {
                        res.status(404).json({ success: false, message: "vendorId does not exist"});
                    } else {
                        res.status(200).json({ 
                            success: true,
                            updatedVendor: updatedVendor
                        });
                    }
                }
            )
        }
    })
};
/**
 * Update vendor information (POST)
 */
exports.updateVendor = function (req, res) {
    // Locate vendor by id
    Vendor.findById(req.params.id).then((vendor) => {
        if(!vendor) {
            res.status(409).json('vendor not found in database');
        } else {
            // Update vendor status
            Vendor.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true },
                function (err, updatedVendor) {
                    if(err) {
                    res.status(404).json({ success: false, err});
                    } else {
                    res.status(200).json({ success: true, updatedVendor: updatedVendor});
                    }
                }
            )
        }
    })
};