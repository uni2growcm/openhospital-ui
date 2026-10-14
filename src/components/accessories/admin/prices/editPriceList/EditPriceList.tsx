import { Navigate, useLocation, useParams } from 'react-router';
import { AdminActivityContent } from '~/components/activities/adminActivity';
import { useTranslation } from '~/libraries/hooks';
import { useAppDispatch, useAppSelector } from '~/libraries/hooks/redux';
import { PATHS } from '../../../../../consts';
import type { PriceListDTO } from '../../../../../generated';
import { updatePriceList } from '../../../../../state/prices';
import PriceListForm from '../priceListForm/PriceListForm';
import { getInitialFields } from '../priceListForm/consts';

export const EditPriceList = () => {
	const dispatch = useAppDispatch();
	const { t } = useTranslation();
	const { state }: { state: PriceListDTO | undefined } = useLocation();
	const { id } = useParams();
	const update = useAppSelector((state) => state.prices.updatePriceList);

	const handleSubmit = (value: PriceListDTO) => {
		dispatch(
			updatePriceList({
				id: state?.id ?? 0,
				priceListDTO: { ...value, id: state?.id, lock: state?.lock },
			}),
		);
	};

	if (state?.id?.toString() !== id?.toString()) {
		return <Navigate to={PATHS.admin_price_lists} />;
	}

	return (
		<AdminActivityContent title={t('pricelist.updatePriceList')}>
			<PriceListForm
				creationMode={false}
				onSubmit={handleSubmit}
				isLoading={!!update.isLoading}
				resetButtonLabel={t('common.reset')}
				submitButtonLabel={t('pricelist.updatePriceList')}
				fields={getInitialFields(state)}
			/>
		</AdminActivityContent>
	);
};
