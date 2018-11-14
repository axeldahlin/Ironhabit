
const User       = require("./models/User");
const Goal       = require("./models/Goal");
const tools      = require('./time-functions');


let numberDaysSuccessful = function(goal) {
  return goal.history.reduce(function(acc,date){
    return acc + date.value
  },0)
}

let numberDaysAttempted = function(goal) {
  return goal.history.length
}


let currentDaysStreak = function(goal) {
  let streakCounter = 0
  let currentIndex = goal.history.length - 1
  streak = true
  while (streak && currentIndex >= 0) {
    if (goal.history[currentIndex].value === 1) {
      streakCounter++
      currentIndex--;
    }
    else streak = false
  }
  return streakCounter
}





let getSuccessDay = function(user, goals) {
  let doneHabits = 0;
  let missedDays = 0;
  for (let i = 0; i < goals.length; i++) {
    for (let j = 0; j < goals[i].history.length; j++) {
      if (goals[i].history[j] === 0) missedDays++
      if (goals[i].history[j] === 1) doneHabits++
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





 