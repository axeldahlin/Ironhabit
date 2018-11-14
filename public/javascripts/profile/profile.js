axios.get('/api/myPerfomance')
  .then(response => {
    // printTheChart(response.data.bpi)
  })


var ctx = document.getElementById("myChart").getContext('2d');
var myChart = new Chart(ctx, {
    type: 'pie',
    data: {
    datasets: [{
        data: [10, 20, 30],
        backgroundColor: [
        'rbb(200, 0, 0)',
        'Yellow',
        'Blue'
    ]
    }],

    // These labels appear in the legend and in the tooltips when hovering different arcs
    labels: [
        'Red',
        'Yellow',
        'Blue'
    ],
    
}
});