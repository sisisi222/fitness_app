import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, LineElement, Legend, CategoryScale, LinearScale, PointElement, Filler, TimeScale } from 'chart.js';
import 'chartjs-adapter-moment';
import '../../styles/bodyMeasurement/MeasurementProgressChart.css'

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

  // Visibility flags for each measurement type
  const [waistVisible, setWaistVisible] = useState(true);
  const [chestVisible, setChestVisible] = useState(true);
  const [armsVisible, setArmsVisible] = useState(true);
  const [legsVisible, setLegsVisible] = useState(true);
  const [hipVisible, setHipVisible] = useState(true);

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
    const datasets = [];

    // Only push datasets to the array if their visibility flags are true
    if (waistVisible) {
        datasets.push({
            label: 'Waist Size',
            data: measurementData.map(entry => entry.waist),
            borderColor: 'green',
            tension: 0.1,
            fill: false,
            pointStyle: 'rect',
            pointBorderColor: 'green',
            pointBackgroundColor: '#fff',
            showLine: true
        });
    }

    if (chestVisible) {
        datasets.push({
            label: 'Chest Size',
            data: measurementData.map(entry => entry.chest),
            borderColor: 'blue',
            tension: 0.1,
            fill: false,
            pointStyle: 'rect',
            pointBorderColor: 'blue',
            pointBackgroundColor: '#fff',
            showLine: true
        });
    }

    if (armsVisible) {
        datasets.push({
            label: 'Arm Size',
            data: measurementData.map(entry => entry.arms),
            borderColor: 'red',
            tension: 0.1,
            fill: false,
            pointStyle: 'rect',
            pointBorderColor: 'red',
            pointBackgroundColor: '#fff',
            showLine: true
        });
    }

    if (legsVisible) {
        datasets.push({
            label: 'Leg Size',
            data: measurementData.map(entry => entry.legs),
            borderColor: 'purple',
            tension: 0.1,
            fill: false,
            pointStyle: 'rect',
            pointBorderColor: 'purple',
            pointBackgroundColor: '#fff',
            showLine: true
        });
    }

    if (hipVisible) {
        datasets.push({
            label: 'Hip Size',
            data: measurementData.map(entry => entry.hip),
            borderColor: 'orange',
            tension: 0.1,
            fill: false,
            pointStyle: 'rect',
            pointBorderColor: 'orange',
            pointBackgroundColor: '#fff',
            showLine: true
        });
    }

    setChartData({
        labels: measurementData.map(entry => {
            const originalDate = new Date(entry.date);
            return originalDate.toISOString().split('T')[0];
        }),
        datasets: datasets
    });

}, [measurementData, waistVisible, chestVisible, armsVisible, legsVisible, hipVisible]);

  return (
    <div>
        <div>
            <button className="toggle-button" onClick={() => setWaistVisible(!waistVisible)}>On/Off Waist</button>
            <button className="toggle-button" onClick={() => setChestVisible(!chestVisible)}>On/Off Chest</button>
            <button className="toggle-button" onClick={() => setArmsVisible(!armsVisible)}>On/Off Arms</button>
            <button className="toggle-button" onClick={() => setLegsVisible(!legsVisible)}>On/Off Legs</button>
            <button className="toggle-button" onClick={() => setHipVisible(!hipVisible)}>On/Off Hip</button>
        </div>
        <div style={{ width: '1300px', height: '1300px' }}>
            <Line data={chartData} options={options} />
        </div>
    </div>
  );
}

export default MeasurementProgressChart;