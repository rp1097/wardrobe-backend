let mongoose = require('mongoose');

let usersSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users', require: true },
    wardrobeId: { type: mongoose.Schema.Types.ObjectId, ref: 'wardrobes', require: true },
    image: [], //"https://abc.in/userId/wardrobe/outfits/1.jpg"
    name: { type: String, require: true }, // shirt, jeans, shoes, watch
    category: { type: String, require: true }, // top, shoes
    color: { type: String, require: true },  // black, red, blue
    status: { type: Boolean, default: true }, // false- Inactive, true- Active
    createdAt: { type: Date, required: true, default: Date.now },
    updatedAt: { type: Date, required: true, default: Date.now }
});

module.exports = mongoose.model('outfits', usersSchema, 'outfits');