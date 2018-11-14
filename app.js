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
const tools      = require('./time-functions')
const helper     = require('./helper-functions')


const User       = require("./models/User");

    

mongoose
  .connect(process.env.MONGODB_URI, {useNewUrlParser: true})
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




//Weekly and Daily Updates. Updates a goal in Mongo by pushing {date:, value:} to history
// array and updating lastUpdate field.

//WEEKLY UPDATE
function weeklyUpdate(goal) {
  User.findByIdAndUpdate(goal._user, {
    $push: {pastGoals: {
      title: goal.title,
      success: helper.determineWeekSuccess(goal),
      frequency: goal.frequency,
      endDate: tools.currentDate()
    }}
  })
  .then(user=> {
    Goal.findByIdAndUpdate(goal._id, {
      nextWeekUpdate: tools.startDayOfFollowingWeek()
    })
    .then(goal => {
      console.log("Weekly Update: goal  update", goal)
    })
    .catch(err=>{
      console.log("Error at Weekly Update Goal Update",err)
    })
  })
  .catch(err=>{
    console.log("error at addWeekSummary",err)
  })
}

//DAILY UPDATE
function dailyUpdate(goal) {
  Goal.findByIdAndUpdate(goal._id, {
    lastUpdate: tools.currentDate(),
    pointValue: helper.updateGoalPointValue(goal),
    $push: {
      history: {date: tools.currentDate(), value: 0}
    }
  })
  .then(goal=>{
    console.log("dailyUpdate -- goal updated: ", goal)
  })
  .catch(err=> {
    console.log("Error at dailyUpdate",err)
  })
}




//Middlewear to check if the weekly update has been performed
app.use((req,res,next)=> {
  Goal.find({nextWeekUpdate: {$lte: tools.currentDate()}})
  .then(goals=>{
    console.log('GOALS in need of WEEKLY', goals.length, goals)
    for (let i = 0; i<goals.length; i++) {
      console.log("updating goals")
      // storeWeekSummary(goals[i])
      weeklyUpdate(goals[i])
    }
    next();
  })
  .catch(err=> {
    console.log("ERROR at Weekly Update Middlewear", err)
  })
})



//Daily Update: Middlewear to check if there are un-updated goals
//and updates them with updateGoal()
app.use((req,res,next)=> {
  Goal.find({lastUpdate: {$lt: tools.currentDate()}})  
  .then(goals=>{
    console.log("Goals in need of DAILY update!!!!", goals.length, goals)
    for (let i = 0; i<goals.length; i++) {
      console.log("updating daily goals", goals[i])
      dailyUpdate(goals[i])
    }
    next();
  })
  .catch(err=> {
    console.log("ERROR at DAILY Update Middlewear", err)
  })
})









//I Suggest we stop using this function
function getWeekSummary(goal) {
    let today = tools.currentDate();
    let wasSuccessful = () => {
      let lastSevenDays = goal.history.slice(-7); 
      lastSevenDays = lastSevenDays.map(day => day.value);
      let sumOfWeek = lastSevenDays.reduce((item, acc)=> {
      return acc + item; 
      },0)
      if (sumOfWeek >= goal.frequency) return true;
        return false;
    }
    return {
      title: goal.title,
      success: wasSuccessful(),
      frequency: goal.frequency,
      endDate: today,
    }
  }

  function storeWeekSummary(goal) {
    let summary = getWeekSummary(goal);
    User.findByIdAndUpdate(goal._user, {
      $push: {pastGoals: summary}
    })
    .then(user => {

   

      const nextSunday = tools.startDayOfFollowingWeek();

      console.log('DEBUG goal._id:', goal._id)



      Goal.findByIdAndUpdate(goal._id, {
        nextWeekUpdate: nextSunday
      })
      .then(goal=> {
        console.log('DEBUG goal:', goal)
      })
    })
  }

const index = require('./routes/index');
app.use('/', index);

const profile = require('./routes/profile');
app.use('/', profile);

const about = require('./routes/about');
app.use('/', about);

const authRoutes = require('./routes/auth');
app.use('/auth', authRoutes);
      
module.exports = app;
