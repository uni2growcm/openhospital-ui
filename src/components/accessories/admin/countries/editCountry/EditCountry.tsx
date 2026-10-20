import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate, useParams } from 'react-router';
import { AdminActivityContent } from '~/components/activities/adminActivity';
import { useAppDispatch, useAppSelector } from '~/libraries/hooks/redux';
import { PATHS } from '../../../../../consts';
import type { CountryDTO } from '../../../../../generated';
import { updateCountry } from '../../../../../state/countries';
import CountryForm from '../countryForm/CountryForm';
import { getInitialFields } from '../countryForm/consts';

export const EditCountry = () => {
	const dispatch = useAppDispatch();
	const { t } = useTranslation();
	const { state }: { state: CountryDTO | undefined } = useLocation();
	const { id } = useParams();
	const update = useAppSelector((state) => state.countries.update);
	const navigate = useNavigate();

	const handleSubmit = (value: CountryDTO) => {
		if (value.id) {
			dispatch(updateCountry({ id: value.id, countryDTO: value }));
		}
	};

	useEffect(() => {
		if (state?.id !== Number(id)) {
			navigate(PATHS.admin_countries);
		}
	}, [id, navigate, state]);

	return (
		<AdminActivityContent title={t('country.editCountry')}>
			<CountryForm
				creationMode={false}
				onSubmit={handleSubmit}
				isLoading={!!update.isLoading}
				resetButtonLabel={t('common.reset')}
				submitButtonLabel={t('country.updateCountry')}
				fields={getInitialFields(state)}
			/>
		</AdminActivityContent>
	);
};

export default EditCountry;
