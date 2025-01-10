import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js';

// Register necessary components for the bar chart
ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const LikesShares = () => {
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

        // Aggregate likes and shares by post type
        const postTypeLikesShares = data.reduce((acc, row) => {
          const postType = row['Post_Type']?.trim(); // Remove whitespace
          const likes = parseInt(row['Likes'], 10); // Parse likes to integer
          const shares = parseInt(row['Shares'], 10); // Parse shares to integer

          // Skip invalid rows
          if (!postType || postType.toLowerCase() === 'undefined' || isNaN(likes) || isNaN(shares)) return acc;

          if (!acc[postType]) {
            acc[postType] = { likes: 0, shares: 0 };
          }

          acc[postType].likes += likes;
          acc[postType].shares += shares;

          return acc;
        }, {});

        if (Object.keys(postTypeLikesShares).length > 0) {
          const labels = Object.keys(postTypeLikesShares);
          const likesData = Object.values(postTypeLikesShares).map(item => item.likes);
          const sharesData = Object.values(postTypeLikesShares).map(item => item.shares);

          setChartData({
            labels,
            datasets: [
              {
                label: 'Likes',
                data: likesData,
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
                barThickness: 30,
              },
              {
                label: 'Shares',
                data: sharesData,
                backgroundColor: 'rgba(153, 102, 255, 0.6)',
                borderColor: 'rgba(153, 102, 255, 1)',
                borderWidth: 1,
                barThickness: 30,
              },
            ],
          });
        }
      },
    });
  }, []);

  return (
    <div className="p-4 bg-white rounded-lg shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-300">
      <h2 className="text-xl font-semibold mb-4 text-center text-gray-800">Likes and Shares by Post Type</h2>
      {chartData ? (
        <div className="flex justify-center items-center" style={{ width: '100%', height: '300px' }}>
          <Bar
            data={chartData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'top',
                },
                tooltip: {
                  callbacks: {
                    label: (tooltipItem) => {
                      const value = tooltipItem.raw;
                      return `${tooltipItem.dataset.label}: ${value}`;
                    },
                  },
                },
              },
              scales: {
                x: {
                  title: {
                    display: true,
                    text: 'Post Type',
                  },
                },
                y: {
                  title: {
                    display: true,
                    text: 'Count',
                  },
                  beginAtZero: true,
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

export default LikesShares;
