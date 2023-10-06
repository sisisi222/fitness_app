import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, LineElement, Legend, CategoryScale, LinearScale, PointElement, Filler, TimeScale } from 'chart.js';
import 'chartjs-adapter-moment';

ChartJS.register(
  Title, Tooltip, LineElement, Legend,
  CategoryScale, LinearScale, PointElement, Filler, TimeScale
);

function MeasurementProgressChart({ measurementData }) {

  const [chartData, setChartData] = useState({
    labels: measurementData.map(entry => {
        const originalDate = new Date(entry.date);
        return originalDate.toISOString().split('T')[0];
    }),
    datasets: [
      {
        label: 'Waist Size',
        data: measurementData.map(entry => entry.waist),
        borderColor: 'green',
        tension: 0.1,
        fill: false,
        pointStyle: 'rect',
        pointBorderColor: 'green',
        pointBackgroundColor: '#fff',
        showLine: true
      },
      {
        label: 'Chest Size',
        data: measurementData.map(entry => entry.chest),
        borderColor: 'blue',
        tension: 0.1,
        fill: false,
        pointStyle: 'rect',
        pointBorderColor: 'blue',
        pointBackgroundColor: '#fff',
        showLine: true
      },
      {
        label: 'Arm Size',
        data: measurementData.map(entry => entry.arms),
        borderColor: 'red',
        tension: 0.1,
        fill: false,
        pointStyle: 'rect',
        pointBorderColor: 'red',
        pointBackgroundColor: '#fff',
        showLine: true
      },
      {
        label: 'Leg Size',
        data: measurementData.map(entry => entry.legs),
        borderColor: 'purple',
        tension: 0.1,
        fill: false,
        pointStyle: 'rect',
        pointBorderColor: 'purple',
        pointBackgroundColor: '#fff',
        showLine: true,
      },
      {
        label: 'Hip Size',
        data: measurementData.map(entry => entry.hip),
        borderColor: 'orange',
        tension: 0.1,
        fill: false,
        pointStyle: 'rect',
        pointBorderColor: 'orange',
        pointBackgroundColor: '#fff',
        showLine: true
      }
    ]
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
          text: 'Size (in cm)'
        },
        ticks: {
          font: {
            size: 30, // Set the desired font size for the y-axis
          }
        }
      }
    }
    , plugins: {
      legend: {
        labels: {
          font: {
            size: 30, // Set the desired font size for the dataset labels
          },
        },
      },
    },
    elements: {
      point: {
        // You can set font size for point labels here, e.g.:
        font: {
          size: 16, // Set the desired font size for the point labels
        },
      },
    },
  };

  useEffect(() => {
    setChartData({
        labels: measurementData.map(entry => {
            const originalDate = new Date(entry.date);
            return originalDate.toISOString().split('T')[0];
        }),
        datasets: [
          {
            label: 'Waist Size',
            data: measurementData.map(entry => entry.waist),
            borderColor: 'green',
            tension: 0.1,
            fill: false,
            pointStyle: 'rect',
            pointBorderColor: 'green',
            pointBackgroundColor: '#fff',
            showLine: true
          },
          {
            label: 'Chest Size',
            data: measurementData.map(entry => entry.chest),
            borderColor: 'blue',
            tension: 0.1,
            fill: false,
            pointStyle: 'rect',
            pointBorderColor: 'blue',
            pointBackgroundColor: '#fff',
            showLine: true
          },
          {
            label: 'Arm Size',
            data: measurementData.map(entry => entry.arms),
            borderColor: 'red',
            tension: 0.1,
            fill: false,
            pointStyle: 'rect',
            pointBorderColor: 'red',
            pointBackgroundColor: '#fff',
            showLine: true
          },
          {
            label: 'Leg Size',
            data: measurementData.map(entry => entry.legs),
            borderColor: 'purple',
            tension: 0.1,
            fill: false,
            pointStyle: 'rect',
            pointBorderColor: 'purple',
            pointBackgroundColor: '#fff',
            showLine: true
          },
          {
            label: 'Hip Size',
            data: measurementData.map(entry => entry.hip),
            borderColor: 'orange',
            tension: 0.1,
            fill: false,
            pointStyle: 'rect',
            pointBorderColor: 'orange',
            pointBackgroundColor: '#fff',
            showLine: true
          }
        ]
    });
}, [measurementData]);

  return (
    <div style={{ width: '1300px', height: '1300px' }}>
      <Line data={chartData} options={options} />
    </div>
  );
}

export default MeasurementProgressChart;