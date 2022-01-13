var Order = require('../models/orders');
/**
 * Find all orders (GET)
 */
exports.getAllOrders = function (req, res) {
    // Filter orders by target
    Order.find(req.query).populate("vendor").populate("customer").then((orders) => {
        if (orders.length == 0) {
            res.status(404).json({ success: false, errMessage: "Order not found" })
        } else {
            res.status(200).json({ success: true, allOrders: orders})
        }
    })
};
/**
 * Add an Order item (POST)
 */

exports.addOrder = function (req, res) {
    const order = new Order({
        customer: req.body.customer,
        vendor: req.body.vendor,
        snacks: req.body.snacks,
        total: req.body.total
    });
    order.save((err, order) =>{
        if (err){
            res.status(400).json({ success: false, err, err })
        } else {
            res.status(200).json({ success: true, order: order })
        }
  })
};
/**
 * Update an existing order
 */
exports.updateOrder = function (req, res) {
    // Locate the order by id
    Order.findById(req.params.id).then((order) => {
        if(!order) {
            res.status(409).json('Order not found in database');
        } else {
            Order.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true },
                function (err, updatedOrder) {
                    if(err) {
                        res.status(404).json({ success: false, err});
                    } else {
                        res.status(200).json({ success: true, updatedOrder: updatedOrder});
                    }
                }
            )
        }
    })
};