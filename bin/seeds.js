require('dotenv').config();

// Seeds file that remove all users and create 2 new users

// To execute this seed, run from the root of the project
// $ node bin/seeds.js

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Goal = require("../models/Goal");

const User = require("../models/User");


const bcryptSalt = 10;
const salt = bcrypt.genSaltSync(bcryptSalt);

mongoose
  .connect(process.env.MONGODB_URI, {useNewUrlParser: true})
  .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  })
  .catch(err => {
    console.error('Error connecting to mongo', err)
  });

let users = [
  {
  email: "aLongTimeUser",
  firstName: "test",
  password: bcrypt.hashSync("12345", salt),
  pastGoals: [
    { title: 'Yoga', success: false, frequency: 3, endDate: "2018-10-07"},
    { title: 'Morning Meditation', success: false, frequency: 7, endDate: "2018-10-07"},
    { title: 'Call Mom', success: true, frequency: 1, endDate: "2018-10-07"},
    { title: 'Yoga', success: true, frequency: 3, endDate: "2018-10-14"},
    { title: 'Morning Meditation', success: true, frequency: 7, endDate: "2018-10-14"},
    { title: 'Call Mom', success: true, frequency: 1, endDate: "2018-10-14"},
    { title: 'Yoga', success: false, frequency: 3, endDate: "2018-10-21"},
    { title: 'Morning Meditation', success: false, frequency: 7, endDate: "2018-10-21"},
    { title: 'Call Mom', success: true, frequency: 1, endDate: "2018-10-21"},
    { title: 'Yoga', success: true, frequency: 3, endDate: "2018-10-28"},
    { title: 'Morning Meditation', success: false, frequency: 7, endDate: "2018-10-28"},
    { title: 'Call Mom', success: false, frequency: 1, endDate: "2018-10-28"},
    { title: 'Yoga', success: false, frequency: 3, endDate: "2018-10-28"},
    { title: 'Morning Meditation', success: true, frequency: 7, endDate: "2018-10-28"},
    { title: 'Call Mom', success: true, frequency: 1, endDate: "2018-10-28"},
    { title: 'Yoga', success: true, frequency: 3, endDate: "2018-11-04"},
    { title: 'Morning Meditation', success: true, frequency: 7, endDate: "2018-11-04"},
    { title: 'Call Mom', success: true, frequency: 1, endDate: "2018-11-04"},
    { title: 'Yoga', success: true, frequency: 3, endDate: "2018-11-11"},
    { title: 'Morning Meditation', success: true, frequency: 7, endDate: "2018-11-11"},
    { title: 'Call Mom', success: true, frequency: 1, endDate: "2018-11-11"}
  ],
  }
]

let goals = [
  {
    title: "Morning Meditation",
    currentlyDoing: true,
    frequency: 7,
    pointValue: 12,
    history: [
      {date: "2018-10-02", value: 1},
      {date: "2018-10-03", value: 1},
      {date: "2018-10-04", value: 1},
      {date: "2018-10-05", value: 0},
      {date: "2018-10-06", value: 1},
      {date: "2018-10-07", value: 1},
      {date: "2018-10-08", value: 1},
      {date: "2018-10-09", value: 1},
      {date: "2018-10-10", value: 0},
      {date: "2018-10-11", value: 1},
      {date: "2018-10-12", value: 1},
      {date: "2018-10-13", value: 1},
      {date: "2018-10-14", value: 1},
      {date: "2018-10-15", value: 0},
      {date: "2018-10-16", value: 1},
      {date: "2018-10-17", value: 1},
      {date: "2018-10-18", value: 0},
      {date: "2018-10-19", value: 1},
      {date: "2018-10-20", value: 0},
      {date: "2018-10-21", value: 1},
      {date: "2018-10-22", value: 1},
      {date: "2018-10-23", value: 1},
      {date: "2018-10-24", value: 0},
      {date: "2018-10-25", value: 1},
      {date: "2018-10-26", value: 0},
      {date: "2018-10-27", value: 1},
      {date: "2018-10-28", value: 1},
      {date: "2018-10-29", value: 1},
      {date: "2018-10-30", value: 1},
      {date: "2018-10-31", value: 1},
      {date: "2018-11-01", value: 1},
      {date: "2018-11-02", value: 0},
      {date: "2018-11-03", value: 1},
      {date: "2018-11-04", value: 1},
      {date: "2018-11-05", value: 1},
      {date: "2018-11-06", value: 1},
      {date: "2018-11-07", value: 1},
      {date: "2018-11-08", value: 1},
      {date: "2018-11-09", value: 1},
      {date: "2018-11-10", value: 1},
      {date: "2018-11-11", value: 1},
      {date: "2018-11-12", value: 1},
      {date: "2018-11-13", value: 1},
      {date: "2018-11-14", value: 1}
    ],
    lastUpdate: new Date(2018,10,14),
    nextWeekUpdate: new Date(2018,10,21),
    _user: "5bed5f9654ea0a053915d883"
  },
  {
    title: "Yoga",
    currentlyDoing: true,
    frequency: 3,
    pointValue: 2,
    history: [
      {date: "2018-10-02", value: 1},
      {date: "2018-10-03", value: 1},
      {date: "2018-10-04", value: 1},
      {date: "2018-10-05", value: 0},
      {date: "2018-10-06", value: 1},
      {date: "2018-10-07", value: 0},
      {date: "2018-10-08", value: 0},
      {date: "2018-10-09", value: 1},
      {date: "2018-10-10", value: 0},
      {date: "2018-10-11", value: 1},
      {date: "2018-10-12", value: 0},
      {date: "2018-10-13", value: 0},
      {date: "2018-10-14", value: 1},
      {date: "2018-10-15", value: 0},
      {date: "2018-10-16", value: 0},
      {date: "2018-10-17", value: 1},
      {date: "2018-10-18", value: 0},
      {date: "2018-10-19", value: 1},
      {date: "2018-10-20", value: 0},
      {date: "2018-10-21", value: 0},
      {date: "2018-10-22", value: 0},
      {date: "2018-10-23", value: 0},
      {date: "2018-10-24", value: 0},
      {date: "2018-10-25", value: 0},
      {date: "2018-10-26", value: 0},
      {date: "2018-10-27", value: 0},
      {date: "2018-10-28", value: 0},
      {date: "2018-10-29", value: 1},
      {date: "2018-10-30", value: 0},
      {date: "2018-10-31", value: 0},
      {date: "2018-11-01", value: 1},
      {date: "2018-11-02", value: 0},
      {date: "2018-11-03", value: 1},
      {date: "2018-11-04", value: 0},
      {date: "2018-11-05", value: 1},
      {date: "2018-11-06", value: 0},
      {date: "2018-11-07", value: 0},
      {date: "2018-11-08", value: 1},
      {date: "2018-11-09", value: 1},
      {date: "2018-11-10", value: 0},
      {date: "2018-11-11", value: 1},
      {date: "2018-11-12", value: 0},
      {date: "2018-11-13", value: 1},
      {date: "2018-11-14", value: 1},
    ],
    lastUpdate: new Date(2018,10,14),
    nextWeekUpdate: new Date(2018,10,21),
    _user: "5bed5f9654ea0a053915d883"
  },
  {
    title: "Call Mom",
    currentlyDoing: true,
    frequency: 1,
    pointValue: 1,
    history: [
      {date: "2018-10-02", value: 0},
      {date: "2018-10-03", value: 0},
      {date: "2018-10-04", value: 1},
      {date: "2018-10-05", value: 0},
      {date: "2018-10-06", value: 0},
      {date: "2018-10-07", value: 0},
      {date: "2018-10-08", value: 0},
      {date: "2018-10-09", value: 0},
      {date: "2018-10-10", value: 0},
      {date: "2018-10-11", value: 1},
      {date: "2018-10-12", value: 0},
      {date: "2018-10-13", value: 0},
      {date: "2018-10-14", value: 0},
      {date: "2018-10-15", value: 0},
      {date: "2018-10-16", value: 0},
      {date: "2018-10-17", value: 0},
      {date: "2018-10-18", value: 0},
      {date: "2018-10-19", value: 0},
      {date: "2018-10-20", value: 0},
      {date: "2018-10-21", value: 0},
      {date: "2018-10-22", value: 1},
      {date: "2018-10-23", value: 0},
      {date: "2018-10-24", value: 0},
      {date: "2018-10-25", value: 0},
      {date: "2018-10-26", value: 0},
      {date: "2018-10-27", value: 0},
      {date: "2018-10-28", value: 1},
      {date: "2018-10-29", value: 0},
      {date: "2018-10-30", value: 0},
      {date: "2018-10-31", value: 0},
      {date: "2018-11-01", value: 0},
      {date: "2018-11-02", value: 0},
      {date: "2018-11-03", value: 0},
      {date: "2018-11-04", value: 0},
      {date: "2018-11-05", value: 1},
      {date: "2018-11-06", value: 0},
      {date: "2018-11-07", value: 0},
      {date: "2018-11-08", value: 0},
      {date: "2018-11-09", value: 0},
      {date: "2018-11-10", value: 0},
      {date: "2018-11-11", value: 1},
      {date: "2018-11-12", value: 0},
      {date: "2018-11-13", value: 0},
      {date: "2018-11-14", value: 0}
    ],
    lastUpdate: new Date(2018,10,14),
    nextWeekUpdate: new Date(2018,10,21),
    _user: "5bed5f9654ea0a053915d883"
  }
]

User.deleteMany()
.then(() => {
  return User.create(users)
})
.then(usersCreated => {
  console.log(`${usersCreated.length} users created with the following id:`);
  console.log(usersCreated.map(u => u._id));
})
// .then(()=> {
// Goal.deleteMany()
// .then(()=> {
//   console.log("creating goals...")
//   return Goal.create(goals)
// })
// .then(goalsCreated => {
//   console.log("goalsCreated",goalsCreated)
//   console.log(`${goalsCreated.length} goals created with the following id:`);
//   console.log(goalsCreated.map(g => g._id));
// })
// .catch(err=> {
//   console.log("error with goal creation", err)
// })

.then(() => {
  // Close properly the connection to Mongoose
  mongoose.disconnect()
})
.catch(err => {
  mongoose.disconnect()
  throw err
})




