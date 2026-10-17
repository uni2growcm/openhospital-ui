import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import type { ITopItem } from '~/components/accessories/accounting/types';
import { formatCompactAmount } from '../../utils/overviewMining';
import classes from './TopItemsWidget.module.scss';

interface ITopItemsWidgetProps {
	items: ITopItem[];
}

export const TopItemsWidget: FC<ITopItemsWidgetProps> = ({ items }) => {
	const { t } = useTranslation();

	return (
		<div data-cy="overview-top-items-card" className={classes.widgetCard}>
			<h2 className={classes.widgetTitle}>
				{t('accounting.overview.topItems.title')}
			</h2>

			{items.length === 0 ? (
				<div className={classes.emptyState}>
					{t('accounting.overview.topItems.empty')}
				</div>
			) : (
				<div className={classes.itemsList}>
					{items.map((item) => (
						<div
							key={item.id}
							data-cy={`top-item-${item.id}`}
							className={classes.itemRow}
						>
							<div className={classes.itemHeader}>
								<span
									className={classes.itemDescription}
									title={item.description}
								>
									{item.description}
								</span>
								<span className={classes.itemRevenue}>
									{formatCompactAmount(item.revenue)}
								</span>
							</div>
							<div className={classes.progressBarTrack}>
								<div
									className={classes.progressBarFill}
									style={{
										width: `${Math.min(100, Math.max(0, item.percentage))}%`,
									}}
								/>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
};
