"use client";

import React, { useEffect } from "react";
import { Chart } from "react-google-charts";

const data = [
    ["Year", "Sales", "Expenses"],
    ["2013", 1000, 400],
    ["2014", 1170, 460],
    ["2015", 660, 1120],
    ["2016", 1030, 540],
];

export const options = {
    title: 'Transaction Analysis',
    curveType: 'function',
    legend: {
        position: 'bottom',
        textStyle: { color: '#D1D5DB' }, // gray-300
        alignment: 'center',
    },
    backgroundColor: '#121212',
    chartArea: { left: 56, top: 40, right: 16, bottom: 48, width: '100%', height: '100%' },
    titleTextStyle: { color: '#E5E7EB', fontSize: 16, bold: true }, // gray-200
    hAxis: {
        title: 'This Month',
        titleTextStyle: { color: '#94A3B8', italic: false }, // slate-400
        textStyle: { color: '#E5E7EB' }, // gray-200
        baselineColor: '#334155', // slate-700
        gridlines: { color: '#1F2937' }, // gray-800
    },
    vAxis: {
        title: 'Amount',
        minValue: 0,
        titleTextStyle: { color: '#94A3B8', italic: false },
        textStyle: { color: '#E5E7EB' },
        baselineColor: '#334155',
        gridlines: { color: '#1F2937' },
    },
    colors: ['#22D3EE', '#FB7185'], // cyan-400, rose-400
    lineWidth: 3,
    pointSize: 4,
    intervals: { style: 'line' },
};

export default function ChartComponent() {

    const [chartData, setChartData] = React.useState(data);

    const updateChartData = (newData: any) => {
        setChartData(newData);
    };

    useEffect(() => {
        // Simulate an API call to fetch new data
        const fetchData = async () => {
            const response = await fetch('/api/transaction-data');
            const newData = await response.json();

            updateChartData(newData.data);
        };

        fetchData();
    }, []);

    return (
        <Chart
            chartType="LineChart"
            width="100%"
            height="580px"
            data={chartData}
            options={options}
            legendToggle
        />
    );
}