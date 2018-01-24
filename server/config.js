
exports.createRoutes = function(app) {
    app.get('/api/test', (req, res, next) => {
        res.send({text: 'Hola como va'});
    });
}