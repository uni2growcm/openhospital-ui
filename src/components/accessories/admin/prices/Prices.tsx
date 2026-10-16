import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { AdminActivityContent } from '~/components/activities/adminActivity';
import { useAppDispatch } from '~/libraries/hooks/redux';
import { PATHS } from '../../../../consts';
import type { PriceListDTO } from '../../../../generated';
import {
	copyPriceListReset,
	deletePriceList,
	deletePriceListReset,
	getPriceLists,
} from '../../../../state/prices';
import Button from '../../button/Button';
import classes from './Prices.module.scss';
import PricesTable from './pricesTable';

export const Prices = () => {
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const { t } = useTranslation();

	useEffect(() => {
		dispatch(getPriceLists());

		return () => {
			dispatch(deletePriceListReset());
			dispatch(copyPriceListReset());
		};
	}, [dispatch]);

	const handleEdit = (row: PriceListDTO) => {
		navigate(PATHS.admin_price_lists_edit.replace(':id', `${row.id ?? ''}`), {
			state: row,
		});
	};

	const handleDelete = (row: PriceListDTO) => {
		dispatch(deletePriceList(row.id ?? 0));
	};

	return (
		<AdminActivityContent title={t('nav.prices')}>
			<div className={classes.prices} data-cy="prices-table">
				<PricesTable
					onEdit={handleEdit}
					onDelete={handleDelete}
					headerActions={
						<>
							<Button
								onClick={() => {
									navigate(PATHS.admin_prices);
								}}
								type="button"
								variant="text"
								color="primary"
								dataCy="back-to-pricebrowser"
							>
								{t('pricelist.pricebrowser')}
							</Button>
							<Button
								onClick={() => {
									navigate(PATHS.admin_price_lists_new);
								}}
								type="button"
								variant="contained"
								color="primary"
								dataCy="add-new-pricelist"
							>
								{t('pricelist.addPriceList')}
							</Button>
						</>
					}
				/>
			</div>
		</AdminActivityContent>
	);
};
