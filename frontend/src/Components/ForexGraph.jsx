import React, { useEffect, useState } from 'react';
import ApexCharts from 'apexcharts';
import dayjs from 'dayjs';
import axios from 'axios';

function ForexGraph() {
  const [chart, setChart] = useState(null);

  useEffect(() => {
    // Function to fetch data from the API and update the chart
    const fetchDataAndUpdateChart = () => {
      axios.get("http://localhost:3001/forex").then((response) => {
        const forexData = response.data;

        // Update chart data with forexData
        if (chart) {
          chart.updateSeries([{
            data: forexData.map(item => ({
              x: item.time * 1000, // Assuming time is in Unix timestamp format
              y: [item.open, item.high, item.low, item.close]
            }))
          }]);
        }
      }).catch((error) => {
        console.error('Error fetching forex data:', error);
      });
    };

    // Initial fetch and update
    fetchDataAndUpdateChart();

    // Set interval to fetch data and update chart every 5 seconds
    const intervalId = setInterval(fetchDataAndUpdateChart, 5000);

    // Cleanup
    return () => {
      clearInterval(intervalId);
      if (chart) {
        chart.destroy();
      }
    };
  }, [chart]); // Include chart in the dependency array to update when chart changes

  useEffect(() => {
    const options = {
      series: [{
        name: 'candle',
        //open-high-low-close
        data: []
      }],
      chart: {
        height: 350,
        type: 'candlestick',
      },
      title: {
        text: 'CandleStick Chart - Category X-axis',
        align: 'left'
      },
      annotations: {
        xaxis: [
          {
            x: 'Oct 06 14:00',
            borderColor: '#00E396',
            label: {
              borderColor: '#00E396',
              style: {
                fontSize: '12px',
                color: '#fff',
                background: '#00E396'
              },
              orientation: 'horizontal',
              offsetY: 7,
              text: 'Annotation Test'
            }
          }
        ]
      },
      tooltip: {
        enabled: true,
      },
      xaxis: {
        type: 'category',
        labels: {
          formatter: function(val) {
            return dayjs(val).format('MMM DD HH:mm');
          }
        }
      },
      yaxis: {
        tooltip: {
          enabled: true
        }
      }
    };

    const chartInstance = new ApexCharts(document.querySelector("#chart"), options);
    setChart(chartInstance);
    chartInstance.render();

    // Cleanup
    return () => {
      if (chartInstance) {
        chartInstance.destroy();
      }
    };
  }, []); // Empty dependency array to run the effect only once

  return (
    <div id="chart">
      {chart && chart.chart} {/* Render the chart if it exists */}
    </div>
  );
}

export default ForexGraph;
