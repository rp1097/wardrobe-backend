module.exports = function (app) {
    app.use('/api/users', require('./api/users'));
    app.use('/api/wardrobes', require('./api/wardrobes'));
    app.use('/api/outfits', require('./api/outfits'));
}