const mongoose = require("mongoose")

// Customer Schema
const customerSchema = new mongoose.Schema({ 
    givenName: { type: String, },

    familyName: { type: String, },
    
    location: {
        type: { type: String, enum: ['Point'] },
        coordinates: { type: [Number] }
    },

    email: { type: String, required: true, },
    
    password: { type: String, required: true, }
})

module.exports = mongoose.model("customers", customerSchema);