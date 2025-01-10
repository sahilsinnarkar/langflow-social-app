import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js';

// Register necessary components for the bar chart
ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const EarningsGraph = () => {
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

        // Aggregate earnings by category and calculate average earnings
        const categoryEarnings = data.reduce((acc, row) => {
          const category = row['Category']?.trim(); // Remove whitespace
          const earnings = parseFloat(row['Earnings']); // Parse earnings to float

          // Skip invalid rows
          if (!category || category.toLowerCase() === 'undefined' || isNaN(earnings)) return acc;

          // Initialize category if not present in the accumulator
          if (!acc[category]) {
            acc[category] = { total: 0, count: 0 };
          }

          // Add earnings to total and increment count for average calculation
          acc[category].total += earnings;
          acc[category].count += 1;

          return acc;
        }, {});

        // Calculate the average earnings for each category
        const averageEarnings = Object.keys(categoryEarnings).reduce((acc, category) => {
          const { total, count } = categoryEarnings[category];
          acc[category] = total / count; // Average earnings
          return acc;
        }, {});

        // Set the chart data
        if (Object.keys(averageEarnings).length > 0) {
          const labels = Object.keys(averageEarnings);
          const earningsData = Object.values(averageEarnings);

          setChartData({
            labels,
            datasets: [
              {
                label: 'Average Earnings by Category',
                data: earningsData,
                backgroundColor: [
                  'rgba(75, 192, 192, 0.6)',  // Color for business
                  'rgba(255, 99, 132, 0.6)',  // Color for informative
                  'rgba(54, 162, 235, 0.6)',  // Color for entertainment
                  'rgba(255, 206, 86, 0.6)',  // Color for nudity
                  'rgba(153, 102, 255, 0.6)', // Color for abuse
                ],
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
              },
            ],
          });
        }
      },
    });
  }, []);

  return (
    <div className="p-4 bg-white rounded-lg shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-300">
      <h2 className="text-xl font-semibold mb-4 text-center text-gray-800">Average Earnings by Category</h2>
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
                title: {
                  display: true,
                  text: 'Average Earnings by Category',
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
                    text: 'Earnings',
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

export default EarningsGraph;
