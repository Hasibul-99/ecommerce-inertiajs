import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

interface LineChartProps {
    data: {
        labels: string[];
        datasets: {
            label: string;
            data: number[];
            borderColor?: string;
            backgroundColor?: string;
            fill?: boolean;
            tension?: number;
        }[];
    };
    title?: string;
    yAxisLabel?: string;
}

export default function LineChart({ data, title, yAxisLabel }: LineChartProps) {
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top' as const,
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
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: !!yAxisLabel,
                    text: yAxisLabel,
                    font: {
                        family: 'Manrope, sans-serif',
                        size: 12,
                    }
                },
                grid: {
                    color: '#f0f0f0',
                },
                ticks: {
                    font: {
                        family: 'Manrope, sans-serif',
                        size: 11,
                    }
                }
            },
            x: {
                grid: {
                    display: false,
                },
                ticks: {
                    font: {
                        family: 'Manrope, sans-serif',
                        size: 11,
                    }
                }
            }
        }
    };

    return (
        <div className="w-full h-full">
            <Line data={data} options={options} />
        </div>
    );
}
