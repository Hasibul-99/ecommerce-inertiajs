import React from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

interface DonutChartProps {
  data: {
    labels: string[];
    datasets: {
      data: number[];
      backgroundColor?: string[];
      borderColor?: string[];
      borderWidth?: number;
    }[];
  };
  title?: string;
  height?: number;
}

export default function DonutChart({ data, title, height = 300 }: DonutChartProps) {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
      },
      title: {
        display: !!title,
        text: title,
      },
    },
  };

  const defaultColors = [
    '#FF6384',
    '#36A2EB',
    '#FFCE56',
    '#4BC0C0',
    '#9966FF',
    '#FF9F40',
    '#FF6384',
    '#C9CBCF',
  ];

  const chartData = {
    ...data,
    datasets: data.datasets.map((dataset) => ({
      ...dataset,
      backgroundColor: dataset.backgroundColor || defaultColors,
      borderColor: dataset.borderColor || defaultColors.map(color => color + '80'),
      borderWidth: dataset.borderWidth || 2,
    })),
  };

  return (
    <div style={{ height: `${height}px` }}>
      <Doughnut data={chartData} options={options} />
    </div>
  );
}