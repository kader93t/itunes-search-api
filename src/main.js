const express = require('express');
const request = require('postman-request');
require('dotenv').config();
require("./mongoose/mogoose");
const cors = require('cors');
const User = require('./mongoose/user_model');
const app = express();
const auth = require('./middlware/auth');

app.use(express.json());
app.use(cors())
const port = process.env.PORT || 8080

// Search
app.get('/search', auth,(req, res) => {
  
    const { keyword } = req.query;
    console.log(keyword)
    request(`https://itunes.apple.com/search?media=music&term=${keyword}`, function (error, response, body) {
        if (error) {
            res.status(response.status).send(
                {
                    "Error": "We can't handle the request ",
                    "itunes_error": response.response,

                }
            )
        }
        res.status(200).send(JSON.parse(body));
    });

});


// Login 
app.post('/login', async (req, res) => {
    try {
    
      const { email, password } = req.body;
      const user = await User.findByCredential(email, password);
      if (user) {
        const token = await user.generateToken();
        res.send({ user, token });
      } else {
        res.status(404).send({ error: 'Unable to login' });
      }
    } catch (err) {
        // console.log(err);
      res.status(500).send();
    }
  });

  app.post('/logout', auth, async (req, res) => {

    try {
      const user = req.user;
      user.tokens = user.tokens.filter(({ token }) => {
        return req.token != token;
      });
      await user.save();
      res.send();
    } catch (err) {
      res.status(500).send();
    }
  });

  // SignUp
  app.post('/signup', async (req, res) => {
    console.log('la')
    try {
      const {email, password, phone, userName, firstName, lastName } = req.body;
      console.log(userName);
      userObj = await User.findOne(
          {"email": email }
      ).exec();
    console.log('pa')
    console.log(userObj);
      if(userObj){
        const token = await userObj.generateToken();
        const id = userObj._id;
        res.send({ "user_id": id, token });
      }
      userObj = User({
          email,
          password,
          phone,
          userName,
          firstName,
          lastName}
      );
     
     
      const token = await userObj.generateToken();
      const id = userObj._id;
      await userObj.save();
      res.send({ "user_id": id, token });
    
    } catch (err) {
        console.log(err);
      res.status(500).send();
    }
  });

  app.get("*", (req,res)=>{
    res.status(404).send(
      {
        "message": "Not Found",
      }
    )
  })

app.listen(port, () => {
    console.log('server start listinng on port ', port);
})

