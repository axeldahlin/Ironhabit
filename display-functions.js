const tools      = require('./time-functions')

let createDisplayData = function(goal, size) {
  let valuesOnly = goal.history.map(function(date){
    return date.value
  })
  for (let i = 0; i<6-tools.currentDay();i++){
    valuesOnly.push(0);
  }
  for (let i = 0; i<size;i++) {
    valuesOnly.unshift(0);
  }
  return valuesOnly.slice(valuesOnly.length-size)
}

exports.createDisplayData = createDisplayData