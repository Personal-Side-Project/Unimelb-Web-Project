const mongoose = require("mongoose")
const Schema = mongoose.Schema; // Create schema for customer and vendor

// Order Schema
const orderSchema = new Schema({ 
    customer: { type: Schema.Types.ObjectId, ref: 'customers' },
    
    vendor: { type: Schema.Types.ObjectId, ref: 'vendors' },

    snacks: { type: Array, default: [] },
    
    status: { type: String, default: 'outstanding', },
    
    ratings: { type: Number,},
    
    comment: { type: String,},
    
    total: { type: Number, },
    
    discount:{ type: Boolean }
}, { timestamps: true });

module.exports = mongoose.model("orders", orderSchema) 