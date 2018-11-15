var ctxPie = document.getElementById("pie-chart").getContext('2d');

var ctxBar = document.getElementById("bar-graph").getContext('2d');

const ourApi = axios.create({
  baseURL: '/api/userdata'
})

ourApi.get()
  .then(res => {
    console.log("Response from Axios GET", res.data)
    // var ctxPie = document.getElementById("myChart").getContext('2d');
    var pieChart = new Chart(ctxPie, {
      type: 'pie',
      data: {
        datasets: [{
            data: Object.values(res.data.successDaysTotal),
            backgroundColor: [
            'green',
            '#d5dbd2'
        ]
      }],
      // These labels appear in the legend and in the tooltips when hovering different arcs
      labels: [
          'Done :)',
          'Missed :('
      ],
      options: {
        legend: {
          labels: {
            fontSize: 36
          }
        }
      }
    }
    });

    var barGraph = new Chart(ctxBar, {
      type: 'horizontalBar',
      data: {
        datasets: [{
          data: Object.values(res.data.dailySuccessRate),
          backgroundColor: [
            "#068587",
            "black",
            "#068587",
            "black",
            "#068587",
            "black"
          ]
        }],
        labels: Object.keys(res.data.dailySuccessRate)
      },
      options: {
        responsive: true,
        legend: {
          display: false,
          labels: {
            fontSize: 36
          },
        },
        scales: {
          yAxes: [{
            ticks: {
              fontSize: 36
            }
          }],
          xAxes: [{
            ticks: {
              stepSize: 0.25,
              fontSize: 36
            }
          }]
        }
      }
    })

  })
  .catch(err=>{
    console.log("Error at axios GET", err)
  })


