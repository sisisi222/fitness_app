import { useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, LineElement, Legend, CategoryScale, LinearScale, PointElement, Filler, TimeScale } from 'chart.js';
import 'chartjs-adapter-moment';

ChartJS.register(
  Title, Tooltip, LineElement, Legend,
  CategoryScale, LinearScale, PointElement, Filler, TimeScale
);

function WeightProgressChart({ weightData }) {

  const [chartData, setChartData] = useState({
    labels: weightData.map(entry => new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })),
    datasets: [{
      label: 'Weight Over Time',
      data: weightData.map(entry => entry.weight_value),
      borderColor: '#007BFF',
      tension: 0.1,
      fill: false,
      pointStyle: 'rect',
      pointBorderColor: 'blue',
      pointBackgroundColor: '#fff',
      showLine: true
    }]
  });

  const options = {
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'day',
          displayFormats: {
            day: 'MMM D, YYYY'
          },
          tooltipFormat: 'MMM D, YYYY'
        },
        title: {
          display: true,
          text: 'Date'
        },
        ticks: {
          font: {
            size: 30, // Set the desired font size for the x-axis
          }
        }
      },
      y: {
        title: {
          display: true,
          text: 'Weight (in kg)'
        },
        ticks: {
          font: {
            size: 30, // Set the desired font size for the y-axis
          }
        }
      }
    }
  };  

  return (
    <div style={{ width: '1300px', height: '1300px' }}>
      <Line data={chartData} options={options} />
    </div>
  );
}

export default WeightProgressChart;
