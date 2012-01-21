module.exports = function (app, service) {
    var accountMiddleware = service.useModule('middleware/account');

    app.get('/', accountMiddleware.requireRole('user'), function(req, res){
        res.render('index', { title: "Index" });
    });
};
