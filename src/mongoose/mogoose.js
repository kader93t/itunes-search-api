const mongoose = require('mongoose');
// const url = `mongodb+srv://kader93t:abdo1993@cluster0.ikh69.mongodb.net/job-test?retryWrites=true&w=majority`;

console.log(process.env);
mongoose.connect(process.env.MONGO_URL,{
  
useNewUrlParser: true, 

useUnifiedTopology: true 
  }).then( () => {
    console.log('Connected to database ')
})
.catch( (err) => {
    console.error(`Error connecting to the database. \n${err}`);
})

module.exports = mongoose;