import {
	BarElement,
	CategoryScale,
	Chart as ChartJS,
	Legend,
	LinearScale,
	Title,
	Tooltip,
} from 'chart.js';
import { type FC, useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import { useTranslation } from 'react-i18next';
import type { IMonthlyPaymentsDebts } from '~/components/accessories/accounting/types';
import { formatNumberWithSpaces } from '../../utils/overviewMining';
import classes from './PaymentsDebtsChart.module.scss';

ChartJS.register(
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend,
);

interface IPaymentsDebtsChartProps {
	data: IMonthlyPaymentsDebts[];
}

export const PaymentsDebtsChart: FC<IPaymentsDebtsChartProps> = ({ data }) => {
	const { t } = useTranslation();

	const chartData = useMemo(() => {
		return {
			labels: data.map((d) => d.monthLabel),
			datasets: [
				{
					label: t('accounting.overview.chart.paid'),
					data: data.map((d) => d.paid),
					backgroundColor: '#0f233a',
					borderRadius: 4,
					barPercentage: 0.65,
					stack: 'stack1',
				},
				{
					label: t('accounting.overview.chart.notPaid'),
					data: data.map((d) => d.notPaid),
					backgroundColor: '#e9a83b',
					borderRadius: 4,
					barPercentage: 0.65,
					stack: 'stack1',
				},
			],
		};
	}, [data, t]);

	const options = useMemo(() => {
		return {
			responsive: true,
			maintainAspectRatio: false,
			plugins: {
				legend: {
					position: 'top' as const,
					align: 'end' as const,
					labels: {
						usePointStyle: true,
						pointStyle: 'rect',
						boxWidth: 10,
						boxHeight: 10,
						font: {
							size: 12,
							weight: 500,
						},
						color: '#334155',
					},
				},
				tooltip: {
					callbacks: {
						label: (context: any) => {
							const label = context.dataset.label || '';
							const val = context.raw || 0;
							return `${label}: ${formatNumberWithSpaces(val)} FCFA`;
						},
					},
				},
			},
			scales: {
				x: {
					stacked: true,
					grid: {
						display: false,
					},
					ticks: {
						font: {
							size: 11,
						},
						color: '#64748b',
					},
				},
				y: {
					stacked: true,
					grid: {
						color: '#f1f5f9',
					},
					ticks: {
						font: {
							size: 11,
						},
						color: '#64748b',
						callback: (value: any) => {
							if (value >= 1_000_000) {
								return `${(value / 1_000_000).toFixed(0)} M`;
							}
							return value >= 1000 ? `${(value / 1000).toFixed(0)} k` : value;
						},
					},
				},
			},
		};
	}, []);

	return (
		<div data-cy="overview-chart-card" className={classes.chartCard}>
			<div className={classes.chartHeader}>
				<h2 className={classes.chartTitle}>
					{t('accounting.overview.chart.title')}
				</h2>
			</div>
			<div className={classes.chartContainer}>
				<Bar data={chartData} options={options} />
			</div>
		</div>
	);
};
