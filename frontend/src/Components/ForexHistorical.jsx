import React, { useEffect, useState } from 'react';
import ApexCharts from 'apexcharts';
import dayjs from 'dayjs';
import axios from 'axios';
import RefreshButton from './Accessories/RefreshButton';

function ForexHistorical() {
  const [chart, setChart] = useState(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState('M15');
  const [showOptions, setShowOptions] = useState(false);

  const handleToggleOptions = () => {
    setShowOptions(!showOptions);
  };

  
  


  useEffect(() => {
    const options = {
      series: [{
        name: 'candle',
        data: []
      }],
      chart: {
        height: 350,
        type: 'candlestick',
      },
      title: {
        text: `EURUSD ${selectedTimeframe}`, // Dynamic title based on selectedTimeframe
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
          },
          style: {
            colors: '#D100FF' // Set the color for x-axis labels
          }
        },
        axisBorder: {
          show: true,
          color: '#FF0000' // Set the color for the x-axis border
        },
        axisTicks: {
          show: true,
          color: '#FF0000' // Set the color for the x-axis ticks
        }
      },
      yaxis: {
        tooltip: {
          enabled: true
        },
        labels: {
          style: {
            colors: '#D100FF' // Set the color for y-axis labels
          }
        },
        axisBorder: {
          show: true,
          color: '#FF0000' // Set the color for the y-axis border
        },
        axisTicks: {
          show: true,
          color: '#FF0000' // Set the color for the y-axis ticks
        }
      }
    };

    // Destroy existing chart if it exists
    if (chart) {
      chart.destroy();
    }

    // Create new chart instance
    const chartInstance = new ApexCharts(document.querySelector("#chart"), options);
    setChart(chartInstance);
    chartInstance.render();

    // Cleanup
    return () => {
      if (chartInstance) {
        chartInstance.destroy();
      }
    };
  }, [selectedTimeframe]); // Re-run effect when selectedTimeframe changes

  useEffect(() => {
    // Function to fetch data from the API and update the chart
    const fetchDataAndUpdateChart = async () => {
        const response = await axios.get("http://localhost:3001/forexh").then((response) => {
        const forexData =  response.data;

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
    // const intervalId = setInterval(fetchDataAndUpdateChart, 5000);

    // Cleanup
    return () => {
    //   clearInterval(intervalId);
    };
  }, [chart]); // Include chart in the dependency array to update when chart changes


  useEffect(() => {
    if (!chart) return;
  
    const chartInstance = new ApexCharts(document.querySelector("#chart"), options);
    setChart(chartInstance);
    chartInstance.render();
  
    return () => {
      chartInstance.destroy();
    };
  }, [selectedTimeframe]);

  
  return (
    <>
        <div id="chart">
            {chart && chart.chart} 
        </div>
        <RefreshButton></RefreshButton>
      
    </>
  );
}

export default ForexHistorical;
