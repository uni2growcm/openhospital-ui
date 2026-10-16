import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { AdminActivityContent } from '~/components/activities/adminActivity';
import { useAppDispatch } from '~/libraries/hooks/redux';
import { deleteCountry } from '~/state/countries';
import { PATHS } from '../../../../consts';
import type { CountryDTO } from '../../../../generated';
import Button from '../../button/Button';
import classes from './Countries.module.scss';
import CountriesTable from './countriesTable';

export const Countries = () => {
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const { t } = useTranslation();

	const handleEdit = (row: CountryDTO) => {
		if (row?.id != null) {
			navigate(PATHS.admin_countries_edit.replace(':id', `${row.id}`), {
				state: row,
			});
		}
	};

	const handleDelete = (row: CountryDTO) => {
		if (row?.id != null) {
			dispatch(deleteCountry(row.id));
		}
	};

	return (
		<AdminActivityContent title={t('nav.countries')}>
			<div className={classes.countries}>
				<CountriesTable
					onEdit={handleEdit}
					onDelete={handleDelete}
					headerActions={
						<Button
							onClick={() => {
								navigate(PATHS.admin_countries_new);
							}}
							type="button"
							variant="contained"
							color="primary"
						>
							{t('country.addCountry')}
						</Button>
					}
				/>
			</div>
		</AdminActivityContent>
	);
};

export default Countries;
