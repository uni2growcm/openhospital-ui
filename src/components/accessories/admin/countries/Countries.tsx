import { Search } from '@mui/icons-material';
import { InputAdornment, TextField } from '@mui/material';
import { type ChangeEvent, useState } from 'react';
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
	const [searchTerm, setSearchTerm] = useState('');

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
				<div className={classes.topBar}>
					<div className={classes.searchBox}>
						<TextField
							fullWidth
							size="small"
							variant="outlined"
							placeholder={t('country.searchPlaceholder', {
								defaultValue: 'Search country...',
							})}
							value={searchTerm}
							onChange={(e: ChangeEvent<HTMLInputElement>) =>
								setSearchTerm(e.target.value)
							}
							InputProps={{
								startAdornment: (
									<InputAdornment position="start">
										<Search fontSize="small" />
									</InputAdornment>
								),
							}}
						/>
					</div>
					<div className={classes.headerActions}>
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
					</div>
				</div>
				<CountriesTable
					onEdit={handleEdit}
					onDelete={handleDelete}
					searchTerm={searchTerm}
				/>
			</div>
		</AdminActivityContent>
	);
};

export default Countries;
