


let toggleValueAndPoints = function(goal) {
  let newValue;
  let pointChange;
  if (goal.history[goal.history.length -1].value === 1) {
    newValue = 0;
    pointChange = -goal.pointValue
  } else {
    newValue = 1;
    pointChange = goal.pointValue
  }
  return [newValue,pointChange]
}

let updateGoalPointValue = function(goal) {
  let newPointValue;
  if (goal.history[goal.history.length-1].value === 0) newPointValue = 1
  else newPointValue = goal.pointValue + 1;
  return newPointValue
}

let determineWeekSuccess = function(goal) {
  let lastSevenDays = goal.history.slice(-7)
  console.log("GOAL: ", goal)
  console.log("lastSevenDays",lastSevenDays)
  let numberOfSuccesses = lastSevenDays.map(day=>day.value).filter(val=>{return val>0}).length
  if (numberOfSuccesses >= goal.frequency) return true
  else return false
}




exports.toggleValueAndPoints = toggleValueAndPoints
exports.updateGoalPointValue = updateGoalPointValue
exports.determineWeekSuccess = determineWeekSuccess



