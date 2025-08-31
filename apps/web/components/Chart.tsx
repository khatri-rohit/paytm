"use client";

import React, { useEffect, useState } from "react";
import { Chart } from "react-google-charts";
import './chartStyles.css';
import { Circle } from 'lucide-react';

// const data = [
//     ["Year", "Sales", "Expenses"],
//     ["2013", 1000, 400],
//     ["2014", 1170, 460],
//     ["2015", 660, 1120],
//     ["2016", 1030, 540],
// ];

export const options = {
    title: 'Transaction Analysis',
    backgroundColor: '#0B1220',
    chartArea: { left: 84, top: 40, right: 28, bottom: 88, width: '100%', height: '100%' },
    curveType: 'function',
    colors: ['#22D3EE', '#FB7185'],
    lineWidth: 3,
    pointSize: 4,
    legend: {
        position: 'bottom',
        alignment: 'center',
        textStyle: { color: '#E5E7EB', fontSize: 12 },
    },
    titleTextStyle: { color: '#FFFFFF', fontSize: 16, bold: true }, // pure white title
    hAxis: {
        title: 'This Month',
        format: 'MM DD YYYY',                         // readable date labels
        titleTextStyle: { color: '#94A3B8', italic: false, bold: false, fontName: 'Inter, system-ui, Segoe UI, Arial' },
        textStyle: { color: '#F1F5F9', fontSize: 12, italic: false, bold: false, fontName: 'Inter, system-ui, Segoe UI, Arial' },
        slantedText: true,
        slantedTextAngle: 60,
        showTextEvery: 1,
        baselineColor: '#334155',
        gridlines: { color: '#1F2937' },
        minorGridlines: { color: '#0B1220' },
    },
    vAxis: {
        title: 'Amount',
        viewWindow: { min: 0 },
        format: '#,###',
        titleTextStyle: { color: '#94A3B8', italic: false, bold: false, fontName: 'Inter, system-ui, Segoe UI, Arial' },
        baselineColor: '#334155',
        gridlines: { color: '#1F2937' },
        minorGridlines: { color: '#0B1220' },
    },
    focusTarget: 'category',
    crosshair: { trigger: 'both', orientation: 'both', color: '#64748B', opacity: 0.6 },
    tooltip: {
        isHtml: true,                            // allows custom dark tooltip styles
        textStyle: { color: '#121212', fontSize: 14 },
        showColorCode: true,
        trigger: 'focus',
    },
    allowContainerBoundaryTextOverflow: true,
};

export default function ChartComponent() {

    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(true);

    const updateChartData = (newData: any) => {
        setChartData(newData);
    };

    useEffect(() => {
        // Simulate an API call to fetch new data
        const fetchData = async () => {
            setLoading(true);
            const response = await fetch('/api/transaction-data', {
                next: {
                    revalidate: 60,
                    tags: ['transaction-history']
                } // revalidate every 60 seconds
            });
            const newData = await response.json();

            updateChartData(newData.data);
            setLoading(false);
        };

        fetchData();
    }, []);

    return (
        <div className="rounded-xl border border-slate-800 bg-[#0B1220] p-4">
            {loading ? (
                <div className="flex items-center justify-center h-[550px]">
                    <Circle className="animate-spin h-10 w-10 text-gray-600" />
                </div>
            ) : (
                <Chart
                    chartType="LineChart"
                    width="100%"
                    height="550px"
                    data={chartData}
                    options={options}
                    legendToggle
                />
            )}
        </div>
    );
}