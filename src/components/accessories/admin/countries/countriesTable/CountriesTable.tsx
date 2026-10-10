import { CircularProgress } from '@mui/material';
import { type ReactNode, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import ConfirmationDialog from '~/components/accessories/confirmationDialog/ConfirmationDialog';
import { useAppDispatch, useAppSelector } from '~/libraries/hooks/redux';
import checkIcon from '../../../../../assets/check-icon.png';
import type { CountryDTO } from '../../../../../generated';
import {
	deleteCountryReset,
	getCountries,
} from '../../../../../state/countries';
import InfoBox from '../../../infoBox/InfoBox';
import type { TFilterField } from '../../../table/filter/types';
import Table from '../../../table/Table';
import classes from './CountriesTable.module.scss';

interface IOwnProps {
	onEdit: (row: any) => void;
	onDelete: (row: any) => void;
	headerActions?: ReactNode;
}

export const CountriesTable = ({
	onEdit,
	onDelete,
	headerActions,
}: IOwnProps) => {
	const dispatch = useAppDispatch();
	const { t } = useTranslation();
	const infoBoxRef = useRef<HTMLDivElement>(null);

	const header = ['isoCode', 'name', 'phoneCode'];

	const label = {
		isoCode: t('country.isoCode'),
		name: t('country.name'),
		phoneCode: t('country.phoneCode'),
	};

	const order = ['isoCode', 'name', 'phoneCode'];

	const filters: TFilterField[] = [
		{ key: 'isoCode', label: t('country.isoCode'), type: 'text' },
		{ key: 'name', label: t('country.name'), type: 'text' },
		{ key: 'phoneCode', label: t('country.phoneCode'), type: 'text' },
	];

	const { data, status, error } = useAppSelector(
		(state) => state.countries.countryList,
	);

	const deleteCountryState = useAppSelector((state) => state.countries.delete);

	const formatDataToDisplay = (countries: CountryDTO[]) => {
		return countries.map((item) => ({
			id: item.id,
			isoCode: item.isoCode ?? '',
			name: item.name ?? '',
			phoneCode: item.phoneCode ?? '',
			lock: item.lock ?? 0,
		}));
	};

	const formattedRows = formatDataToDisplay(data ?? []);

	const handleEdit = (row: CountryDTO) => {
		onEdit((data ?? []).find((item) => item.id === row?.id));
	};

	return (
		<div className={classes.table}>
			{(() => {
				switch (status) {
					case 'FAIL':
						return (
							<InfoBox
								type="error"
								message={
									error?.message
										? t(error?.message)
										: t('common.somethingwrong')
								}
							/>
						);
					case 'LOADING':
						return (
							<CircularProgress
								style={{ marginLeft: '50%', position: 'relative' }}
							/>
						);

					case 'SUCCESS':
						return (
							<>
								<Table
									rowData={formattedRows}
									rawData={formattedRows}
									tableHeader={header}
									labelData={label}
									columnsOrder={order}
									rowsPerPage={10}
									isCollapsabile={true}
									onEdit={handleEdit}
									onDelete={onDelete}
									filterColumns={filters}
									showEmptyCell={false}
									rowKey="isoCode"
									manualFilter={false}
									headerActions={headerActions}
								/>
								{deleteCountryState.isLoading && (
									<div ref={infoBoxRef} className="info-box-container">
										<InfoBox type="info" message={t('country.deleting')} />
									</div>
								)}
								{deleteCountryState.status === 'FAIL' && (
									<div ref={infoBoxRef} className="info-box-container">
										<InfoBox
											type="error"
											message={
												deleteCountryState.error?.message
													? t(deleteCountryState.error?.message)
													: t('common.somethingwrong')
											}
										/>
									</div>
								)}
								<ConfirmationDialog
									isOpen={deleteCountryState.status === 'SUCCESS'}
									title={t('country.deleted')}
									icon={checkIcon}
									info={t('country.deleteSuccess')}
									primaryButtonLabel="Ok"
									handlePrimaryButtonClick={() => {
										dispatch(getCountries(undefined));
										dispatch(deleteCountryReset());
									}}
									handleSecondaryButtonClick={() => ({})}
								/>
							</>
						);
					case 'SUCCESS_EMPTY':
						return <InfoBox type="info" message={t('common.emptydata')} />;
					default:
						return;
				}
			})()}
		</div>
	);
};

export default CountriesTable;
