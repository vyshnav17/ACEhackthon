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
                label: 'Skill Match %',
                data: data,
                backgroundColor: 'rgba(45, 91, 255, 0.1)',
                borderColor: '#2D5BFF',
                borderWidth: 3,
                pointBackgroundColor: '#2D5BFF',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: '#2D5BFF',
                pointRadius: 4,
            },
        ],
    };

    const options = {
        scales: {
            r: {
                angleLines: { color: '#E9ECEF' },
                grid: { color: '#E9ECEF' },
                pointLabels: {
                    color: '#495057',
                    font: { size: 10, weight: 'bold' as const }
                },
                ticks: { display: false, stepSize: 20 },
                suggestedMin: 0,
                suggestedMax: 100
            }
        },
        plugins: {
            legend: { display: false }
        },
        maintainAspectRatio: false
    };

    return (
        <div className="w-full h-full p-2">
            <Radar data={chartData} options={options as any} />
        </div>
    );
};
