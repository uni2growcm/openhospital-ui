import { useTranslation } from 'react-i18next';
import { AdminActivityContent } from '~/components/activities/adminActivity';
import { useAppDispatch, useAppSelector } from '~/libraries/hooks/redux';
import type { PriceListDTO } from '../../../../../generated';
import { createPriceList } from '../../../../../state/prices';
import { getInitialFields } from '../priceListForm/consts';
import PriceListForm from '../priceListForm/PriceListForm';

export const NewPriceList = () => {
	const dispatch = useAppDispatch();
	const { t } = useTranslation();
	const create = useAppSelector((state) => state.prices.createPriceList);

	const handleSubmit = (value: PriceListDTO) => {
		dispatch(createPriceList(value));
	};

	return (
		<AdminActivityContent title={t('pricelist.addPriceList')}>
			<PriceListForm
				creationMode
				onSubmit={handleSubmit}
				isLoading={!!create.isLoading}
				resetButtonLabel={t('common.reset')}
				submitButtonLabel={t('pricelist.savePriceList')}
				fields={getInitialFields(undefined)}
			/>
		</AdminActivityContent>
	);
};
