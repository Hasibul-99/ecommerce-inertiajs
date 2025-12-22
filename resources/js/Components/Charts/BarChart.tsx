import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

interface BarChartProps {
    data: {
        labels: string[];
        datasets: {
            label: string;
            data: number[];
            backgroundColor?: string | string[];
            borderColor?: string | string[];
            borderWidth?: number;
        }[];
    };
    title?: string;
    yAxisLabel?: string;
    horizontal?: boolean;
}

export default function BarChart({ data, title, yAxisLabel, horizontal = false }: BarChartProps) {
    const options = {
        indexAxis: horizontal ? ('y' as const) : ('x' as const),
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
                    display: !!yAxisLabel && !horizontal,
                    text: yAxisLabel,
                    font: {
                        family: 'Manrope, sans-serif',
                        size: 12,
                    }
                },
                grid: {
                    color: horizontal ? 'transparent' : '#f0f0f0',
                },
                ticks: {
                    font: {
                        family: 'Manrope, sans-serif',
                        size: 11,
                    }
                }
            },
            x: {
                beginAtZero: horizontal,
                title: {
                    display: !!yAxisLabel && horizontal,
                    text: yAxisLabel,
                    font: {
                        family: 'Manrope, sans-serif',
                        size: 12,
                    }
                },
                grid: {
                    color: horizontal ? '#f0f0f0' : 'transparent',
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
            <Bar data={data} options={options} />
        </div>
    );
}
