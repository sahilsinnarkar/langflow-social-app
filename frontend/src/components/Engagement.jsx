import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, PointElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js';

// Register necessary components for the line chart
ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const Engagement = () => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    // Path to your CSV file
    const csvFilePath = '/new_cleaned_data.csv';

    // Parse the CSV file
    Papa.parse(csvFilePath, {
      download: true,
      header: true,
      complete: (results) => {
        const data = results.data;

        // Aggregate engagement by category
        const categoryEngagement = data.reduce((acc, row) => {
          const category = row['Category']?.trim(); // Remove whitespace
          const engagement = parseFloat(row['Engagement']); // Parse engagement to float

          // Skip invalid rows
          if (!category || category.toLowerCase() === 'undefined' || isNaN(engagement)) return acc;

          acc[category] = (acc[category] || 0) + engagement;
          return acc;
        }, {});

        // Set the chart data
        if (Object.keys(categoryEngagement).length > 0) {
          const labels = Object.keys(categoryEngagement);
          const engagementData = Object.values(categoryEngagement);

          setChartData({
            labels,
            datasets: [
              {
                label: 'Engagement by Category',
                data: engagementData,
                fill: false, // Line chart with no fill
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 2,
                pointBackgroundColor: 'rgba(75, 192, 192, 1)', // Point color for visibility
              },
            ],
          });
        }
      },
    });
  }, []);

  return (
    <div className="p-4 bg-white rounded-lg shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-300">
      <h2 className="text-xl font-semibold mb-4 text-center text-gray-800">Engagement by Category</h2>
      {chartData ? (
        <div className="flex justify-center items-center" style={{ width: '100%', height: '300px' }}>
          <Line
            data={chartData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'top',
                },
                title: {
                  display: true,
                  text: 'Engagement by Category',
                },
              },
              scales: {
                x: {
                  title: {
                    display: true,
                    text: 'Category',
                  },
                },
                y: {
                  title: {
                    display: true,
                    text: 'Engagement',
                  },
                },
              },
            }}
            style={{
              maxHeight: '300px',
              maxWidth: '100%',
            }}
          />
        </div>
      ) : (
        <p className="text-center">Loading data...</p>
      )}
    </div>
  );
};

export default Engagement;
