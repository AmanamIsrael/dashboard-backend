const dotenv = require('dotenv')
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 3000;

//initialize dotenv
dotenv.config();
//middlewares
app.use(express.json());

//connect to mongoose DB
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('connected to database'))
    .catch(err => console.log(err));

// import routes
const authRoute = require('./routes/auth');
const usersRoute = require('./routes/users');


// route middlewares
app.use('/api/user', authRoute);
app.use('/api/users', usersRoute);

// listen at specified port
app.listen(port, () => {
    console.log(`server running at http://localhost:${port}`);
})