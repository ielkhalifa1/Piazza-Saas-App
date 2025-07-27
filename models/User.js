const mongoose  = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        minlength: 3,    
        maxlength: 256,
    },
    email: {
        type: String,
        required: true,
        minlength: 6,    
        maxlength: 256,
        match: [/.+@.+\..+/, "Please enter a valid email address"]
    },
    password: {
        type: String,
        required: true,
        minlength: 6,    
        maxlength: 1024,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', userSchema);
