
const mongoose = require("mongoose") ;


const detailsSchema = new mongoose.Schema({
    id :Number ,
    name: String,
    email: String,
    gender: String,
    status: String,
    created_at: Date,
    updated_at: Date
})


const User = mongoose.model('goldStoneDetails', detailsSchema); 

module.exports = User