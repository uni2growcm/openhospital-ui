import { CircularProgress } from '@mui/material';
import { type ReactNode, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ConfirmationDialog from '~/components/accessories/confirmationDialog/ConfirmationDialog';
import { resolveApiErrorMessage } from '~/libraries/apiUtils/resolveApiErrorMessage';
import { useAppDispatch, useAppSelector } from '~/libraries/hooks/redux';
import { scrollToElement } from '~/libraries/uiUtils/scrollToElement';
import checkIcon from '../../../../../assets/check-icon.png';
import type { CountryDTO } from '../../../../../generated';
import {
	deleteCountryReset,
	getCountriesPaged,
} from '../../../../../state/countries';
import InfoBox from '../../../infoBox/InfoBox';
import type { TFilterField } from '../../../table/filter/types';
import Table from '../../../table/Table';
import classes from './CountriesTable.module.scss';

const DEFAULT_PAGE_SIZE = 10;

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

	const [page, setPage] = useState(0);
	const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

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

	const {
		data: pagedData,
		status,
		error,
	} = useAppSelector((state) => state.countries.pagedCountries);

	const data = pagedData?.data;
	const pageInfo = pagedData?.pageInfo;

	const deleteCountryState = useAppSelector((state) => state.countries.delete);

	useEffect(() => {
		dispatch(
			getCountriesPaged({
				page,
				size: pageSize,
			}),
		);
	}, [dispatch, page, pageSize]);

	useEffect(() => {
		if (deleteCountryState.status === 'FAIL') {
			scrollToElement(infoBoxRef.current);
		}

		if (
			deleteCountryState.status === 'SUCCESS' ||
			deleteCountryState.status === 'SUCCESS_EMPTY'
		) {
			dispatch(
				getCountriesPaged({
					page,
					size: pageSize,
				}),
			);
		}
	}, [deleteCountryState.status, dispatch, page, pageSize]);

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
								message={resolveApiErrorMessage(error, t)}
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
								{(data ?? []).length === 0 ? (
									<>
										{headerActions && (
											<div className={classes.header}>
												<div className={classes.headerActions}>
													{headerActions}
												</div>
											</div>
										)}
										<InfoBox type="info" message={t('common.emptydata')} />
									</>
								) : (
									<Table
										rowData={formattedRows}
										rawData={data}
										tableHeader={header}
										labelData={label}
										columnsOrder={order}
										rowsPerPage={pageSize}
										isCollapsabile={false}
										onEdit={handleEdit}
										onDelete={onDelete}
										showEmptyCell={false}
										filterColumns={filters}
										rowKey="id"
										manualFilter={false}
										headerActions={headerActions}
										serverPagination={{
											page,
											totalPages: pageInfo?.totalPages ?? 0,
											totalElements: pageInfo?.totalNbOfElements,
											setPage,
											pageSize,
											setPageSize,
										}}
									/>
								)}
								{deleteCountryState.isLoading && (
									<div ref={infoBoxRef} className="info-box-container">
										<InfoBox type="info" message={t('country.deleting')} />
									</div>
								)}
								{deleteCountryState.status === 'FAIL' && (
									<div ref={infoBoxRef} className="info-box-container">
										<InfoBox
											type="error"
											message={resolveApiErrorMessage(
												deleteCountryState.error,
												t,
											)}
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
										dispatch(
											getCountriesPaged({
												page,
												size: pageSize,
											}),
										);
										dispatch(deleteCountryReset());
									}}
									handleSecondaryButtonClick={() => ({})}
								/>
							</>
						);
					case 'SUCCESS_EMPTY':
						return (
							<>
								{headerActions && (
									<div className={classes.header}>
										<div className={classes.headerActions}>{headerActions}</div>
									</div>
								)}
								<InfoBox type="info" message={t('common.emptydata')} />
							</>
						);
					default:
						return;
				}
			})()}
		</div>
	);
};

export default CountriesTable;
