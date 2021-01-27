const express = require('express')
const cors = require('cors')
const app = express()
const port = process.env.PORT || 4000
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const passport = require('passport')

require('dotenv').config()

/*db connection*/
const uri = process.env.ATLAS_URI;
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });
const connection = mongoose.connection;
connection.once('open', () => {
  console.log("MongoDB database connection established successfully");
})

/*init cookie parser*/
app.use(cookieParser());

/*configure app*/
app.use('*', cors());
app.use(morgan('dev'));

/*parse application/x-www-form-urlencoded*/
app.use(bodyParser.urlencoded({extended: true}));

/*parse application/json*/
app.use(bodyParser.json());

/*init and configure passport*/
app.use(passport.initialize());
app.use(passport.session()); 

/*bring in our user routes*/
const routes = require("./routes/router");
app.use("/", routes);

app.listen(port, () => {
    console.log(`App is running on ${port}`);
});
