let mongoose = require('mongoose');

let usersSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: {
        type: String, trim: true,
        unique: 'Email already exists',
        match: [/.+\@.+\..+/, 'Please fill a valid email address'],
        required: 'Email is required',
    },
    mobile: { type: String, required: true },
    gender: { type: String }, // MALE, FEMALE
    dob: { type: String },
    profile: { type: String },
    address: { type: String },
    password: { type: String, required: true },
    status: { type: Boolean, default: true }, // false- Inactive, true- Active
    createdAt: { type: Date, required: true, default: Date.now },
    updatedAt: { type: Date, required: true, default: Date.now }
});

module.exports = mongoose.model('users', usersSchema, 'users');