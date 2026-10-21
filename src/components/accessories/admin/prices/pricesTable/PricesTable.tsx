import { ContentCopy } from '@mui/icons-material';
import {
	CircularProgress,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	IconButton,
	TextField,
} from '@mui/material';
import { type ReactNode, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { resolveApiErrorMessage } from '~/libraries/apiUtils/resolveApiErrorMessage';
import { useAppDispatch, useAppSelector } from '~/libraries/hooks/redux';
import checkIcon from '../../../../../assets/check-icon.png';
import type { PriceListDTO } from '../../../../../generated';
import { scrollToElement } from '../../../../../libraries/uiUtils/scrollToElement';
import {
	copyPriceList,
	copyPriceListReset,
	deletePriceListReset,
	getPriceLists,
} from '../../../../../state/prices';
import Button from '../../../button/Button';
import ConfirmationDialog from '../../../confirmationDialog/ConfirmationDialog';
import InfoBox from '../../../infoBox/InfoBox';
import type { TFilterField } from '../../../table/filter/types';
import Table from '../../../table/Table';
import classes from './PricesTable.module.scss';

interface IOwnProps {
	onEdit: (row: any) => void;
	onDelete: (row: any) => void;
	headerActions?: ReactNode;
}

export const PricesTable = ({ onEdit, onDelete, headerActions }: IOwnProps) => {
	const dispatch = useAppDispatch();
	const { t } = useTranslation();
	const infoBoxRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		dispatch(getPriceLists());
	}, [dispatch]);

	const header = ['code', 'name', 'description', 'currency'];

	const label = {
		code: t('pricelist.code'),
		name: t('pricelist.name'),
		description: t('pricelist.description'),
		currency: t('pricelist.currency'),
	};

	const order = ['code', 'name', 'description', 'currency'];

	const { data, status, error } = useAppSelector(
		(state) => state.prices.getPriceLists,
	);

	const deletePriceList = useAppSelector(
		(state) => state.prices.deletePriceList,
	);
	const copyPriceListState = useAppSelector(
		(state) => state.prices.copyPriceList,
	);

	const [duplicateRow, setDuplicateRow] = useState<PriceListDTO | null>(null);
	const [factor, setFactor] = useState('1');
	const [step, setStep] = useState('0.25');

	const closeDuplicateDialog = () => {
		setDuplicateRow(null);
		setFactor('1');
		setStep('0.25');
	};

	const handleDuplicateConfirm = () => {
		if (duplicateRow?.id === undefined || duplicateRow?.id === null) {
			return;
		}
		dispatch(
			copyPriceList({
				id: duplicateRow.id,
				factor: Number.parseFloat(factor),
				step: Number.parseFloat(step),
			}),
		);
	};

	useEffect(() => {
		if (copyPriceListState.status === 'SUCCESS') {
			setDuplicateRow(null);
			setFactor('1');
			setStep('0.25');
			dispatch(getPriceLists());
		}
	}, [copyPriceListState.status, dispatch]);

	const filters: TFilterField[] = [
		{ key: 'name', label: t('pricelist.name'), type: 'text' },
		{ key: 'description', label: t('pricelist.description'), type: 'text' },
		{ key: 'currency', label: t('pricelist.currency'), type: 'text' },
	];

	const handleEdit = (row: PriceListDTO) => {
		onEdit((data ?? []).find((item) => item.id === row?.id));
	};

	const handleDelete = (row: PriceListDTO) => {
		onDelete(row);
	};

	useEffect(() => {
		if (deletePriceList.status === 'FAIL') {
			scrollToElement(infoBoxRef.current);
		}

		if (
			deletePriceList.status === 'SUCCESS' ||
			deletePriceList.status === 'SUCCESS_EMPTY'
		) {
			dispatch(getPriceLists());
		}
	}, [deletePriceList.status, dispatch]);

	const formatDataToDisplay = (data: PriceListDTO[]) => {
		return data.map((item) => {
			return {
				id: item.id,
				code: item.code ?? '',
				name: item.name ?? '',
				description: item.description ?? '',
				currency: item.currency ?? '',
				lock: item.lock,
			};
		});
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
								{deletePriceList.status === 'FAIL' && (
									<div ref={infoBoxRef} className="info-box-container">
										<InfoBox
											type="error"
											message={resolveApiErrorMessage(deletePriceList.error, t)}
										/>
									</div>
								)}
								<Table
									rowData={formatDataToDisplay(data ?? [])}
									tableHeader={header}
									labelData={label}
									columnsOrder={order}
									rowsPerPage={10}
									isCollapsabile={false}
									showEmptyCell={false}
									filterColumns={filters}
									rawData={data}
									manualFilter={false}
									rowKey="id"
									headerActions={headerActions}
									onEdit={handleEdit}
									onDelete={handleDelete}
									renderCustomActions={(row) => (
										<IconButton
											data-cy="duplicate-pricelist"
											size="small"
											title={t('pricelist.duplicateTitle')}
											onClick={() =>
												setDuplicateRow(
													(data ?? []).find((item) => item.id === row.id) ??
														null,
												)
											}
										>
											<ContentCopy fontSize="small" />
										</IconButton>
									)}
								/>
								<ConfirmationDialog
									isOpen={!!deletePriceList.hasSucceeded}
									title={t('pricelist.deleted')}
									icon={checkIcon}
									info={t('pricelist.deleteSuccess')}
									primaryButtonLabel="Ok"
									handlePrimaryButtonClick={() => {
										dispatch(deletePriceListReset());
									}}
									handleSecondaryButtonClick={() => ({})}
								/>
								<Dialog open={!!duplicateRow} onClose={closeDuplicateDialog}>
									<DialogTitle>{t('pricelist.duplicateTitle')}</DialogTitle>
									<DialogContent
										sx={{
											display: 'flex',
											flexDirection: 'column',
											gap: 2,
											minWidth: 280,
										}}
									>
										<TextField
											size="small"
											label={t('pricelist.factor')}
											type="number"
											value={factor}
											onChange={(e) => setFactor(e.target.value)}
											disabled={!!copyPriceListState.isLoading}
										/>
										<TextField
											size="small"
											label={t('pricelist.step')}
											type="number"
											value={step}
											onChange={(e) => setStep(e.target.value)}
											disabled={!!copyPriceListState.isLoading}
										/>
										{copyPriceListState.status === 'FAIL' && (
											<InfoBox
												type="error"
												message={resolveApiErrorMessage(
													copyPriceListState.error,
													t,
												)}
											/>
										)}
									</DialogContent>
									<DialogActions>
										<Button
											type="button"
											variant="text"
											onClick={closeDuplicateDialog}
										>
											{t('common.cancel')}
										</Button>
										<Button
											type="button"
											variant="contained"
											disabled={!!copyPriceListState.isLoading}
											onClick={handleDuplicateConfirm}
										>
											{t('common.ok')}
										</Button>
									</DialogActions>
								</Dialog>
								<ConfirmationDialog
									isOpen={!!copyPriceListState.hasSucceeded}
									title={t('pricelist.duplicated')}
									icon={checkIcon}
									info={t('pricelist.duplicateSuccess')}
									primaryButtonLabel="Ok"
									handlePrimaryButtonClick={() => {
										dispatch(copyPriceListReset());
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
