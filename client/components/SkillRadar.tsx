"use client";
import {
    Chart as ChartJS,
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';

ChartJS.register(
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend
);

export const SkillRadar = ({ data, labels }: { data: number[], labels: string[] }) => {
    const chartData = {
        labels: labels,
        datasets: [
            {
                label: 'Your Skill Level',
                data: data,
                backgroundColor: 'rgba(99, 102, 241, 0.2)', // Brand primary with opacity
                borderColor: '#6366f1', // Brand primary solid
                borderWidth: 3,
                pointBackgroundColor: '#fff',
                pointBorderColor: '#6366f1',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: '#6366f1',
            },
        ],
    };

    const options = {
        scales: {
            r: {
                beginAtZero: true,
                max: 100,
                ticks: {
                    stepSize: 20,
                    backdropColor: 'transparent',
                    color: 'rgba(255, 255, 255, 0.3)',
                    font: { size: 10 }
                },
                grid: {
                    color: 'rgba(255, 255, 255, 0.05)',
                },
                angleLines: {
                    color: 'rgba(255, 255, 255, 0.05)',
                },
                pointLabels: {
                    color: 'rgba(255, 255, 255, 0.8)',
                    font: {
                        size: 12,
                        family: "'Inter', sans-serif",
                        weight: 'bold' as const
                    }
                }
            }
        },
        plugins: {
            legend: {
                display: false
            }
        },
        maintainAspectRatio: false
    };

    return (
        // Wrapper for sizing
        <div className="w-full h-full p-2">
            <Radar data={chartData} options={options} />
        </div>
    );
};
