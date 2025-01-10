import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js';
import Papa from 'papaparse';

// Register necessary Chart.js components
ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const BarChart = () => {
    const [chartData, setChartData] = useState(null);

    useEffect(() => {
        console.log('Chart Data:', chartData);
    }, [chartData]);

    useEffect(() => {
        // Path to your CSV file
        const csvFilePath = '/new_cleaned_data.csv';

        // Parse the CSV file
        Papa.parse(csvFilePath, {
            download: true,
            header: true,
            complete: (results) => {
                const data = results.data;

                // Aggregate likes by category
                const categoryLikes = data.reduce((acc, row) => {
                    const category = row['Category']?.trim(); // Remove whitespace
                    const likes = parseInt(row['Likes'], 10);

                    // Skip invalid rows
                    if (!category || category.toLowerCase() === 'undefined' || isNaN(likes)) return acc;

                    acc[category] = (acc[category] || 0) + likes;
                    return acc;
                }, {});

                // Debugging: Check aggregated data
                console.log('Aggregated Category Likes:', categoryLikes);

                if (Object.keys(categoryLikes).length > 0) {
                    const labels = Object.keys(categoryLikes);
                    const likesData = Object.values(categoryLikes);

                    setChartData({
                        labels,
                        datasets: [
                            {
                                label: 'Total Likes by Category',
                                data: likesData,
                                backgroundColor: [
                                    'rgba(75, 192, 192, 0.6)',
                                    'rgba(255, 99, 132, 0.6)',
                                    'rgba(54, 162, 235, 0.6)',
                                    'rgba(255, 206, 86, 0.6)',
                                    'rgba(153, 102, 255, 0.6)',
                                    'rgba(255, 159, 64, 0.6)',
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

    if (!chartData) {
        return <p>Loading chart...</p>;
    }

    return (
        <div className="p-4 bg-white rounded-lg shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-300">
            <h2 className="text-xl font-semibold mb-4 text-center text-gray-800">Likes by Post Category</h2>
            <Bar
                data={chartData}
                options={{
                    responsive: true,
                    maintainAspectRatio: true, // Keep aspect ratio
                    plugins: {
                        legend: {
                            position: 'top',
                        },
                        title: {
                            display: true,
                            text: 'Likes by Category',
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
                                text: 'Likes',
                            },
                        },
                    },
                }}
                style={{
                    maxHeight: '300px', // Adjust height
                    maxWidth: '100%', // Make it responsive
                }}
            />
        </div>
    );
};

export default BarChart;
