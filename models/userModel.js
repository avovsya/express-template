module.exports = function (mongoose) {
    var crypto = require('crypto');
    var modelObject = {};
    
    function validatePresenceOf(value) {
        return value && value.length;
    }
    
    modelObject.schema = new mongoose.Schema({
            email: { type: String, validate: [validatePresenceOf, 'An email is required'], match: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,  index: { unique: true } },
            hashedPassword: String,
            salt: String,
            role: { type: String, default: 'user', enum: ['user', 'admin'] },
    });
    
    modelObject.schema.pre('save', function (next) {
        if (!validatePresenceOf(this.password)) {
            next(new Error('Invalid password'));
        } else {
            next();
        }
    });
    
    modelObject.schema.virtual('password')
        .set(function(password) {
            this._password = password;
            this.salt = this.makeSalt();
            this.hashedPassword = this.encryptPassword(password);
        })
        .get(function() { return this._password; });
    
    modelObject.schema.methods.encryptPassword = function (password) {
        var pass =  crypto.createHmac('sha1', this.salt).update(password).digest('hex');
        return pass;
    };
    
    modelObject.schema.methods.makeSalt = function () {
        return Math.round((new Date().valueOf() * Math.random())) + '';  
    };
    
    modelObject.schema.methods.authenticate = function (password) {
        return this.encryptPassword(password) === this.hashedPassword;
    };
        
    
    modelObject.model = mongoose.model('User', modelObject.schema);
    
    return modelObject;
};