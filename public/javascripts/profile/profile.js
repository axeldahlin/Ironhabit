axios.get('/api/myPerfomance')
  .then(response =>{
    // printTheChart(response.data.bpi)
  })

var ctx = document.getElementById("myChart").getContext('2d');



printTheChart();

function printTheChart (data) {

  const label = 3;
  const costs = 3;

  let ctx = document.getElementById('myChart').getContext('2d');
  let chart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: label,
      datasets: [{
        label: "Stock Chart",
        backgroundColor: 'rgb(255, 99, 132)',
        borderColor: 'rgb(255, 99, 132)',
        data: costs,
      }]
    }
  });
};
