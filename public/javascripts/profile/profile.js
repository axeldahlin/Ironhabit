var ctxPie = document.getElementById("pie-chart").getContext('2d');
var densityCanvas = document.getElementById("densityChart");


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

    Chart.defaults.global.defaultFontFamily = "Lato";
    Chart.defaults.global.defaultFontSize = 18;

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
