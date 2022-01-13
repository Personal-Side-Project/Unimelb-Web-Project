const mongoose = require("mongoose")

// Snack Schema
const snackSchema = new mongoose.Schema({ 
    snackName: { type:String },

    price: { type:String },

    image: { type:String },

    description: { type:String }
})

module.exports =  mongoose.model("snacks", snackSchema) 