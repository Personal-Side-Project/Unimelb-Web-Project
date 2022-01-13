const mongoose = require("mongoose")

// Vendor Schema
const vendorSchema = new mongoose.Schema({ 
    vendorName: { type:String },

    password: { type:String },

    location: {
        type: { type: String, enum: ['Point'] },
        coordinates: { type: [Number] }
    },

    status: { type:String, default:'closed' },

    textAddress: { type:String }
})

module.exports = mongoose.model("vendors", vendorSchema) 