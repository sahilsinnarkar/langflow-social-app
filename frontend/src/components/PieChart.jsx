import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Register the necessary components for the pie chart
ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = () => {
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

                // Aggregate reach by post type (static, reel, carousel)
                const postTypeReach = data.reduce((acc, row) => {
                    const postType = row['Post_Type']?.trim(); // Remove whitespace
                    const reach = parseInt(row['Reach'], 10);

                    // Skip invalid rows
                    if (!postType || postType.toLowerCase() === 'undefined' || isNaN(reach)) return acc;

                    acc[postType] = (acc[postType] || 0) + reach;
                    return acc;
                }, {});

                // Debugging: Check aggregated data
                console.log('Aggregated Post Type Reach:', postTypeReach);

                if (Object.keys(postTypeReach).length > 0) {
                    const labels = Object.keys(postTypeReach);
                    const reachData = Object.values(postTypeReach);

                    setChartData({
                        labels,
                        datasets: [
                            {
                                label: 'Reach by Post Type',
                                data: reachData,
                                backgroundColor: [
                                    'rgba(75, 192, 192, 0.6)',  // Color for static posts
                                    'rgba(255, 99, 132, 0.6)',  // Color for reel posts
                                    'rgba(54, 162, 235, 0.6)',  // Color for carousel posts
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
            <h2 className="text-xl font-semibold mb-4 text-center text-gray-800">Reach by Post Type</h2>
            {chartData ? (
                <div className="flex justify-center items-center" style={{ width: '100%', height: '300px' }}>
                    <Pie data={chartData} />
                </div>
            ) : (
                <p className="text-center">Loading data...</p>
            )}
        </div>
    );
};

export default PieChart;
