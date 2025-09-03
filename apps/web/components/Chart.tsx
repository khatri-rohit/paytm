"use client";

import React, { useEffect, useState } from "react";
import { Chart } from "react-google-charts";
import { Circle } from "lucide-react";
import type { GoogleChartFormatter } from "react-google-charts";

export const options = {
    title: "Transaction Analysis of This Month",
    backgroundColor: "#0B1220",
    chartArea: { left: 64, top: 40, right: 20, bottom: 100, width: "100%", height: "100%" },
    curveType: "function",
    colors: ["#22D3EE", "#FB7185"],
    lineWidth: 3,
    pointSize: 5,
    legend: {
        position: "bottom",
        alignment: "center",
        textStyle: { color: "#E5E7EB", fontSize: 13 },
    },
    titleTextStyle: { color: "#FFFFFF", fontSize: 18, bold: true },
    hAxis: {
        title: "This Month",
        format: "MMM dd",
        textStyle: { color: "#F1F5F9", fontSize: 12, italic: false },
        titleTextStyle: { color: "#94A3B8", italic: false, bold: false },
        slantedText: false,
        showTextEvery: 1,
        baselineColor: "#334155",
        gridlines: { color: "#1F2937" },
    },
    vAxis: {
        title: "Amount",
        viewWindow: { min: 0 },
        format: "#,###",
        titleTextStyle: { color: "#94A3B8", italic: false, bold: false },
        baselineColor: "#334155",
        gridlines: { color: "#1F2937" },
    },
    focusTarget: "category",
    crosshair: { trigger: "both", orientation: "both", color: "#64748B", opacity: 0.6 },
    tooltip: {
        isHtml: false,
        trigger: "both",
    },
    allowContainerBoundaryTextOverflow: true,
};

const formatters: GoogleChartFormatter[] = [
    {
        type: "DateFormat",
        column: 0,
        options: { pattern: "MMM dd" }, // axis
    },
    {
        type: "NumberFormat",
        column: 1,
        options: { prefix: "₹", groupingSymbol: ",", fractionDigits: 0 },
    },
    {
        type: "NumberFormat",
        column: 2,
        options: { prefix: "₹", groupingSymbol: ",", fractionDigits: 0 },
    },
];

export default function ChartComponent() {
    const [chartData, setChartData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const response = await fetch("/api/transaction-data", {
                next: { revalidate: 60, tags: ["transaction-history"] },
            });
            const newData = await response.json();

            // Convert string dates to local Date objects
            const formatted = newData.data.map((row: any, idx: number) => {
                if (idx === 0) return row; // header row
                const [year, month, day] = row[0].split("-").map(Number);
                return [new Date(year, month - 1, day), ...row.slice(1)];
            });

            setChartData(formatted);
            setLoading(false);
        };

        fetchData();
    }, []);

    return (
        <div className="rounded-2xl border border-slate-800 bg-[#0B1220] p-6 shadow-lg">
            {loading ? (
                <div className="flex flex-col items-center justify-center h-[400px] gap-2">
                    <Circle className="animate-spin h-8 w-8 text-cyan-400" />
                    <span className="text-gray-400 text-sm">Loading chart...</span>
                </div>
            ) : (
                <Chart
                    chartType="LineChart"
                    width="100%"
                    height="400px"
                    data={chartData}
                    options={options}
                    formatters={formatters}
                />
            )}
        </div>
    );
}
