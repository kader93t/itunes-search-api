const jwt = require('jsonwebtoken');
const { ObjectID } = require('bson');
const User = require('../mongoose/user_model');
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_PASS_PHRASE);
    const filter = {
      _id: ObjectID(decoded.id),
      'tokens.token': token,
    };
    const user = await User.findOne(filter);
    if (user) {
      req.token = token;
      req.user = user;
      next();
    } else {
      res.status(401).send({ error: 'Not autenticated' });
     
    }
  } catch (err) {
    res.status(401).send({ error: 'Not autenticated' });
  }
};

module.exports = auth;
