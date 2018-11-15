var ctx = document.getElementById("myChart").getContext('2d');




const ourApi = axios.create({
  baseURL: '/api/userdata'
})


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

