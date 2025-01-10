import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, PointElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js';

// Register necessary components for the line chart
ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const FollowersGrowth = () => {
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

        // Aggregate follower growth by category
        const categoryFollowerGrowth = data.reduce((acc, row) => {
          const category = row['Category']?.trim(); // Remove whitespace
          const followerGrowth = parseFloat(row['Follower_Growth']); // Parse follower growth to float

          // Skip invalid rows
          if (!category || category.toLowerCase() === 'undefined' || isNaN(followerGrowth)) return acc;

          acc[category] = (acc[category] || 0) + followerGrowth;
          return acc;
        }, {});

        // Set the chart data
        if (Object.keys(categoryFollowerGrowth).length > 0) {
          const labels = Object.keys(categoryFollowerGrowth);
          const followerGrowthData = Object.values(categoryFollowerGrowth);

          setChartData({
            labels,
            datasets: [
              {
                label: 'Follower Growth by Category',
                data: followerGrowthData,
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
      <h2 className="text-xl font-semibold mb-4 text-center text-gray-800">Follower Growth by Category</h2>
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
                  text: 'Follower Growth by Category',
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
                    text: 'Follower Growth',
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

export default FollowersGrowth;
