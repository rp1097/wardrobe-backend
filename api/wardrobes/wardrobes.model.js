let mongoose = require('mongoose');

let usersSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users', require: true },
    status: { type: Boolean, default: true }, // false- Inactive, true- Active
    createdAt: { type: Date, required: true, default: Date.now },
    updatedAt: { type: Date, required: true, default: Date.now }
});

module.exports = mongoose.model('wardrobes', usersSchema, 'wardrobes');