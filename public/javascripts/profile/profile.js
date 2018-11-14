var ctx = document.getElementById("myChart").getContext('2d');

const ourApi = axios.create({
  baseURL: '/api/userdata'
})

<<<<<<< HEAD
=======
var ctx = document.getElementById("myChart").getContext('2d');
var myChart = new Chart(ctx, {
    type: 'pie',
    data: {
    datasets: [{
        data: [10, 20, 30],
        backgroundColor: [
        'rgb(200, 0, 0)',
        'yellow',
        'blue'
    ]
    }],
>>>>>>> b05e9fc669f1e8617ca7fbf804421385455f9f3d

ourApi.get()
  .then(res => {
    console.log("Response from Axios GET", res.data)
    // var ctx = document.getElementById("myChart").getContext('2d');
    var myChart = new Chart(ctx, {
      type: 'pie',
      data: {
      datasets: [{
          data: Object.values(res.data),
          backgroundColor: [
          'green',
          'red'
      ]
      }],
      // These labels appear in the legend and in the tooltips when hovering different arcs
      labels: [
          'Done :)',
          'Missed :('
      ],
    }
    });
  })
  .catch(err=>{
    console.log("Error at axios GET", err)
  })

