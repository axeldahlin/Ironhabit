
const User       = require("./models/User");
const Goal       = require("./models/Goal");
const tools      = require('./time-functions');


let convertToPercentageString = function(float) {
  let p = float*100
  return p.toString() + "%"
}

let numberDaysSuccessful = function(goal) {
  return goal.history.reduce(function(acc,date){
    return acc + date.value
  },0)
}

let numberDaysAttempted = function(goal) {
  return goal.history.length
}

//
let percentSuccessHabitWeeks = function(user) {
  let val = user.pastGoals.filter(week=>{return week.success}).length/user.pastGoals.length
  return convertToPercentageString(val)
}


let currentDaysStreak = function(goal) {
  let streakCounter = 0
  let currentIndex = goal.history.length - 2
  streak = true
  while (streak && currentIndex >= 0) {
    if (goal.history[currentIndex].value === 1) {
      streakCounter++
      currentIndex--;
    }
    else streak = false
  }
  streakCounter += goal.history[goal.history.length-1].value
  return streakCounter
}


//input here is a user's goal (array)
let determineLongestCurrentStreak = function(goals) {
  let [topGoal,highestStreakValue] = [0,0];
  for (let i = 0; i<goals.length; i++) {
    if (currentDaysStreak(goals[i]) > highestStreakValue) {
      highestStreakValue = currentDaysStreak(goals[i]);
      topGoal = goals[i].title
    }
  }
  return [topGoal,highestStreakValue]
}


let numberDailySuccessesGoal = function(goal) {
  return goal.history.filter(day=>{return day.value===1}).length
}




let getSuccessDay = function(goals) {
  let doneHabits = 0;
  let missedDays = 0;
  for (let i = 0; i < goals.length; i++) {
    // console.log('DEBUG goals[i].history:', goals[i].history)
    for (let j = 0; j < goals[i].history.length; j++) {
      // console.log('DEBUG goals[i].history[j]:', goals[i].history[j])
      if (goals[i].history[j].value === 0) missedDays++
      if (goals[i].history[j].value === 1) doneHabits++
    }    
  }
  return {
    doneHabits,
    missedDays
  }
}




exports.getSuccessDay = getSuccessDay
exports.currentDaysStreak = currentDaysStreak
exports.numberDaysAttempted = numberDaysAttempted
exports.numberDaysSuccessful = numberDaysSuccessful
exports.numberDailySuccessesGoal = numberDailySuccessesGoal
exports.percentSuccessHabitWeeks = percentSuccessHabitWeeks
exports.determineLongestCurrentStreak = determineLongestCurrentStreak





 