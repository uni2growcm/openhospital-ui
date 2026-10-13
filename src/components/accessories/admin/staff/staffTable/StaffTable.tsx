import { Search } from '@mui/icons-material';
import { CircularProgress, InputAdornment, TextField } from '@mui/material';
import { type FunctionComponent, type ReactNode, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { StaffDTO } from '~/generated/models/StaffDTO';
import { useAppDispatch, useAppSelector } from '~/libraries/hooks/redux';
import checkIcon from '../../../../../assets/check-icon.png';
import { scrollToElement } from '../../../../../libraries/uiUtils/scrollToElement';
import { deleteStaffReset, getStaffPaged } from '../../../../../state/staff';
import ConfirmationDialog from '../../../confirmationDialog/ConfirmationDialog';
import InfoBox from '../../../infoBox/InfoBox';
import Pagination from '../../../pagination/Pagination';
import Table from '../../../table/Table';
import type { TFilterField } from '../../../table/filter/types';
import classes from './StaffTable.module.scss';

const SEARCH_DEBOUNCE_MS = 300;

const DEFAULT_PAGE_SIZE = 10;

interface IOwnProps {
	onEdit: (row: any) => void;
	onDelete: (row: any) => void;
	headerActions?: ReactNode;
}

export const StaffTable: FunctionComponent<IOwnProps> = ({
	onEdit,
	onDelete,
	headerActions,
}) => {
	const dispatch = useAppDispatch();
	const { t } = useTranslation();
	const infoBoxRef = useRef<HTMLDivElement>(null);

	const [page, setPage] = useState(0);
	const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
	const [keyword, setKeyword] = useState('');
	const [debouncedKeyword, setDebouncedKeyword] = useState('');

	const header = ['code', 'firstName', 'lastName', 'profession', 'position', 'phone'];

	const label = {
		code: t('staff.code'),
		firstName: t('staff.firstName'),
		lastName: t('staff.lastName'),
		profession: t('staff.profession'),
		position: t('staff.position'),
		phone: t('staff.phone'),
	};
	const order = ['code', 'firstName', 'lastName', 'profession', 'position', 'phone'];

	const filters: TFilterField[] = [
		{ key: 'firstName', label: t('staff.firstName'), type: 'text' },
		{ key: 'lastName', label: t('staff.lastName'), type: 'text' },
		{ key: 'profession', label: t('staff.profession'), type: 'text' },
		{ key: 'position', label: t('staff.position'), type: 'text' },
		{ key: 'phone', label: t('staff.phone'), type: 'text' },
	];

	const { data: pagedData, status, error } = useAppSelector(
		(state) => state.staff.pagedStaff,
	);

	const data = pagedData?.data;
	const pageInfo = pagedData?.pageInfo;

	const deleteStaffState = useAppSelector((state) => state.staff.delete);

	const handleEdit = (row: StaffDTO) => {
		onEdit((data ?? []).find((item) => item.code === row?.code));
	};

	const handleDelete = (row: StaffDTO) => {
		onDelete(row);
	};

	useEffect(() => {
		const timeout = setTimeout(() => {
			setPage(0);
			setDebouncedKeyword(keyword.trim());
		}, SEARCH_DEBOUNCE_MS);

		return () => clearTimeout(timeout);
	}, [keyword]);

	useEffect(() => {
		dispatch(
			getStaffPaged({ page, size: pageSize, keyword: debouncedKeyword || undefined }),
		);
	}, [dispatch, page, pageSize, debouncedKeyword]);

	useEffect(() => {
		if (deleteStaffState.status === 'FAIL') {
			scrollToElement(infoBoxRef.current);
		}

		if (
			deleteStaffState.status === 'SUCCESS' ||
			deleteStaffState.status === 'SUCCESS_EMPTY'
		) {
			dispatch(
				getStaffPaged({ page, size: pageSize, keyword: debouncedKeyword || undefined }),
			);
		}
	}, [deleteStaffState.status, dispatch, page, pageSize, debouncedKeyword]);

	const searchField = (
		<TextField
			value={keyword}
			onChange={(event) => setKeyword(event.target.value)}
			placeholder={t('common.search')}
			size="small"
			variant="outlined"
			data-cy="staff-search"
			slotProps={{
				input: {
					startAdornment: (
						<InputAdornment position="start">
							<Search fontSize="small" />
						</InputAdornment>
					),
				},
			}}
		/>
	);

	const combinedHeaderActions = (
		<>
			{searchField}
			{headerActions}
		</>
	);

	const formatDataToDisplay = (data: StaffDTO[]) => {
		return data.map((item) => {
			return {
				code: item.code ?? '',
				firstName: item.firstName ?? '',
				lastName: item.lastName ?? '',
				profession: item.profession ?? '',
				position: item.position ?? '',
				phone: item.phone ?? '',
				lock: item.lock,
			};
		});
	};

	return (
		<div className={classes.table}>
			<div className="header">
				<div className="headerActions">{combinedHeaderActions}</div>
			</div>
			{(() => {
				switch (status) {
					case 'FAIL':
						return <InfoBox type="error" message={error?.message} />;
					case 'LOADING':
						return (
							<CircularProgress
								style={{ marginLeft: '50%', position: 'relative' }}
							/>
						);

					case 'SUCCESS':
						return (
							<>
								{deleteStaffState.status === 'FAIL' && (
									<div ref={infoBoxRef} className="info-box-container">
										<InfoBox type="error" message={deleteStaffState.error?.message} />
									</div>
								)}
								{(data ?? []).length === 0 ? (
									<InfoBox type="info" message={t('common.emptydata')} />
								) : (
									<>
										<Table
											rowData={formatDataToDisplay(data ?? [])}
											tableHeader={header}
											labelData={label}
											columnsOrder={order}
											rowsPerPage={pageSize}
											hidePaginator
											isCollapsabile={true}
											onEdit={handleEdit}
											onDelete={handleDelete}
											showEmptyCell={false}
											filterColumns={filters}
											rawData={data}
											manualFilter={false}
											rowKey="code"
										/>
										<Pagination
											page={page}
											totalPages={pageInfo?.totalPages ?? 0}
											totalElements={pageInfo?.totalNbOfElements}
											setPage={setPage}
											pageSize={pageSize}
											setPageSize={setPageSize}
										/>
									</>
								)}
								<ConfirmationDialog
									isOpen={!!deleteStaffState.hasSucceeded}
									title={t('staff.deleted')}
									icon={checkIcon}
									info={t('staff.deleteSuccess')}
									primaryButtonLabel="Ok"
									handlePrimaryButtonClick={() => {
										dispatch(deleteStaffReset());
									}}
									handleSecondaryButtonClick={() => ({})}
								/>
							</>
						);
					default:
						return;
				}
			})()}
		</div>
	);
};
