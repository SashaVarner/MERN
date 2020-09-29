//naming convention for models is an uppercase first letter
//this is called a schema

const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    //put all the attributes in here

    name: {
        type: String,
        required: true
    },
    email: {
        type: String, 
        required: true,
        unique: true // Two people can't use the same email
    },
    password: {
        type: String,
        required: true,
    },
    avatar: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = User = mongoose.model('user', UserSchema);