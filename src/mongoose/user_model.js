const mongoose = require('./mogoose')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validator = require('validator');

const user_schema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    phone: String,
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        validate() {
            if (!validator.default.isEmail)
                throw new Error('you should enter a valid email !');
        },
    },
    phone: String,
    userName: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    tokens: [
        {
            token: {
                type: String,
                required: true,
            },
        },
    ],
});

user_schema.pre('save', async function (next) {
    const user = this;
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
});

user_schema.statics.findByCredential = async (email, pass) => {
    try {
        
        const user = await User.findOne({ email });
        if (user) {
            const isValid = await bcrypt.compare(pass, user.password);
            if (isValid) return user;
            else return false;
        } else return false;
    } catch (err) {
        throw err;
    }
};

user_schema.methods.generateToken = async function () {
    const token = jwt.sign({ id: this._id }, process.env.JWT_PASS_PHRASE);

    this.tokens = this.tokens.concat({ token });
    await this.save();
    return token;
};

const User = mongoose.model('users', user_schema);
module.exports = User;
