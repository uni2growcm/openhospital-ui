import { useTranslation } from 'react-i18next';
import { AdminActivityContent } from '~/components/activities/adminActivity';
import { useAppDispatch, useAppSelector } from '~/libraries/hooks/redux';
import type { CountryDTO } from '../../../../../generated';
import { createCountry } from '../../../../../state/countries';
import CountryForm from '../countryForm/CountryForm';
import { getInitialFields } from '../countryForm/consts';

export const NewCountry = () => {
	const dispatch = useAppDispatch();
	const { t } = useTranslation();
	const create = useAppSelector((state) => state.countries.create);

	const handleSubmit = (value: CountryDTO) => {
		dispatch(createCountry(value));
	};

	return (
		<AdminActivityContent title={t('country.addNewCountry')}>
			<CountryForm
				creationMode
				onSubmit={handleSubmit}
				isLoading={!!create.isLoading}
				resetButtonLabel={t('common.reset')}
				submitButtonLabel={t('country.saveCountry')}
				fields={getInitialFields(undefined)}
			/>
		</AdminActivityContent>
	);
};

export default NewCountry;
