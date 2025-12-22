import { Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
    ArcElement,
    Tooltip,
    Legend
);

interface DoughnutChartProps {
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
}

export default function DoughnutChart({ data, title }: DoughnutChartProps) {
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom' as const,
                labels: {
                    usePointStyle: true,
                    padding: 15,
                    font: {
                        family: 'Manrope, sans-serif',
                        size: 12,
                    }
                }
            },
            title: {
                display: !!title,
                text: title,
                font: {
                    family: 'Poppins, sans-serif',
                    size: 16,
                    weight: 'bold' as const,
                }
            },
            tooltip: {
                backgroundColor: '#4b5966',
                padding: 12,
                titleFont: {
                    family: 'Poppins, sans-serif',
                    size: 14,
                },
                bodyFont: {
                    family: 'Manrope, sans-serif',
                    size: 13,
                },
                cornerRadius: 8,
                callbacks: {
                    label: function(context: any) {
                        const label = context.label || '';
                        const value = context.parsed || 0;
                        const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                        const percentage = ((value / total) * 100).toFixed(1);
                        return `${label}: ${percentage}%`;
                    }
                }
            }
        }
    };

    return (
        <div className="w-full h-full">
            <Doughnut data={data} options={options} />
        </div>
    );
}
