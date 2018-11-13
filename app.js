require('dotenv').config();

const bodyParser   = require('body-parser');
const cookieParser = require('cookie-parser');
const express      = require('express');
const favicon      = require('serve-favicon');
const hbs          = require('hbs');
const mongoose     = require('mongoose');
const logger       = require('morgan');
const path         = require('path');

const session    = require("express-session");
const MongoStore = require('connect-mongo')(session);
const flash      = require("connect-flash");
const Goal       = require("./models/Goal");
    

mongoose
  .connect('mongodb://localhost/goals-project', {useNewUrlParser: true})
  .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  })
  .catch(err => {
    console.error('Error connecting to mongo', err)
  });

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();

// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Express View engine setup

app.use(require('node-sass-middleware')({
  src:  path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  sourceMap: true
}));
      

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));


hbs.registerHelper('ifUndefined', (value, options) => {
  if (arguments.length < 2)
      throw new Error("Handlebars Helper ifUndefined needs 1 parameter");
  if (typeof value !== undefined ) {
      return options.inverse(this);
  } else {
      return options.fn(this);
  }
});
  

// default value for title local
app.locals.title = 'Ironhack project 2';


// Enable authentication using session + passport
app.use(session({
  secret: 'irongenerator',
  resave: true,
  saveUninitialized: true,
  store: new MongoStore( { mongooseConnection: mongoose.connection })
}))
app.use(flash());
require('./passport')(app);

app.use((req,res,next)=> {
  res.locals.isConnected = !!req.user;
  if (res.locals.isConnected) {
    res.locals.currentUser = req.user
  }
  next();
})


//  Fake cron task to run code every minute
let lastMin = new Date().getMinutes()
setInterval(() => {
  let curMin = new Date().getMinutes()
  if (curMin !== lastMin) {
    console.log("New minute, I can perform some task")
    // Check users if the failed or succeeded
    lastMin = curMin
  }
}, 10000)


//Converts 1-2 digit numbers to 2 digits
function twoDigits(n) {
  if (n<10) return "0" + n
  else return "" + n
}

//returns current date in string YYYY-MM-DD
function currentDate() {
  let today = new Date();
  let year = today.getFullYear()
  let month = twoDigits(today.getMonth() + 1)
  let date = twoDigits(today.getDate());
  return year + "-" + month + "-" + date
}


//Updates a goal in Mongo by pushing {date:, value:} to history
// array and updating lastUpdate field
function updateDayGoal(goal) {
  console.log("UpdateGoal called", goal)
  Goal.findByIdAndUpdate(goal._id, {
    lastUpdate: currentDate(),
    $push: {
      history: {date: currentDate(), value: 0}
    }
  })
  .then(goal=>{
    console.log("Goal updated: ", goal)
  })
  .catch(err=> {
    console.log("Error at updateGoal",err)
  })
}


//Middlewear to check if there are un-updated goals
//and updates them with updateGoal()
app.use((req,res,next)=> {
  Goal.find({lastUpdate: {$lt: currentDate()}})
  .then(goals=>{
    for (let i = 0; i<goals.length; i++) {
      updateDayGoal(goals[i])
      
    }
    next();
  })
  .catch(err=> {
    console.log("error at apps.js", err)
    next();
  })
})





    
const index = require('./routes/index');
app.use('/', index);

const profile = require('./routes/profile');
app.use('/', profile);

const authRoutes = require('./routes/auth');
app.use('/auth', authRoutes);
      
module.exports = app;
