var ctxPie = document.getElementById("pie-chart").getContext('2d');
var densityCanvas = document.getElementById("densityChart");

// var ctxBar = document.getElementById("bar-graph").getContext('2d');

const ourApi = axios.create({
  baseURL: '/api/userdata'
})

ourApi.get()
  .then(res => {
    var pieChart = new Chart(ctxPie, {
      type: 'pie',
      data: {
        datasets: [{
            data: Object.values(res.data.successDaysTotal),
            backgroundColor: [
            '#068587',
            '#222121'
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

<<<<<<< HEAD
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
            fontSize: 70
          },
        },
        scales: {
          yAxes: [{
            ticks: {
              fontSize: 70
            }
          }],
          xAxes: [{
            ticks: {
              stepSize: 0.25,
              fontSize: 70
            }
          }]
        }
      }
    })
=======
    Chart.defaults.global.defaultFontFamily = "Lato";
Chart.defaults.global.defaultFontSize = 18;
>>>>>>> 227dfe3b697531533141516a52c5a02ee8caeaef

var densityData = {
  label: 'Consistency Percentage',
  data: Object.values(res.data.dailySuccessRate),
  backgroundColor: [
    '#068587',
    '#068587',
    '#068587',
    '#068587',
    '#068587',
    '#068587',
    '#068587',
    '#068587',
    '#068587'
  ],
  borderColor: [
    '#222121',
    '#222121',
    '#222121',
    '#222121',
    '#222121',
    '#222121',
    '#222121',
    '#222121',
    '#222121'
  ],
  borderWidth: 2,
  hoverBorderWidth: 0
};

var chartOptions = {
  scales: {
    yAxes: [{
      barPercentage: 0.5
    }]
  },
  elements: {
    rectangle: {
      borderSkipped: 'left',
    }
  }
};

var barChart = new Chart(densityCanvas, {
  type: 'horizontalBar',
  data: {
    labels: Object.keys(res.data.dailySuccessRate),
    datasets: [densityData],
  },
  options: chartOptions
});


    
  })
  .catch(err=>{
    console.log("Error at axios GET", err)
  })
