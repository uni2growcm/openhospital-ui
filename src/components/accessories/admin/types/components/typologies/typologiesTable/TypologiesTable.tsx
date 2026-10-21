import { CircularProgress } from '@mui/material';
import { type ReactNode, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { resolveApiErrorMessage } from '~/libraries/apiUtils/resolveApiErrorMessage';
import { useAppDispatch, useAppSelector } from '~/libraries/hooks/redux';
import checkIcon from '../../../../../../../assets/check-icon.png';
import type { TypologyDTO } from '../../../../../../../generated';
import { scrollToElement } from '../../../../../../../libraries/uiUtils/scrollToElement';
import { deleteTypologyReset } from '../../../../../../../state/types/typologies';
import ConfirmationDialog from '../../../../../confirmationDialog/ConfirmationDialog';
import InfoBox from '../../../../../infoBox/InfoBox';
import Table from '../../../../../table/Table';
import './styles.scss';

interface IOwnProps {
	onEdit: (row: TypologyDTO) => void;
	onDelete: (row: TypologyDTO) => void;
	headerActions?: ReactNode;
}

const TypologiesTable = (props: IOwnProps) => {
	const { onDelete, onEdit, headerActions } = props;
	const dispatch = useAppDispatch();
	const { t } = useTranslation();
	const infoBoxRef = useRef<HTMLDivElement>(null);

	const header = ['code', 'description'];

	const label = {
		code: t('common.code'),
		description: t('common.description'),
	};
	const order = ['code', 'description'];

	const { data, status, error } = useAppSelector(
		(state) => state.types.typologies.getTypologies,
	);

	const deleteTypology = useAppSelector(
		(state) => state.types.typologies.delete,
	);

	const handleEdit = (row: TypologyDTO) => {
		const found = (data ?? []).find((item) => item.code === row?.code);
		if (found) {
			onEdit(found);
		}
	};

	const handleDelete = (row: TypologyDTO) => {
		onDelete(row);
	};

	useEffect(() => {
		if (deleteTypology.status === 'FAIL') {
			scrollToElement(infoBoxRef.current);
		}
	}, [deleteTypology.status]);

	const formatDataToDisplay = (rows: TypologyDTO[]) => {
		return rows.map((item) => ({
			code: item.code,
			description: item.description,
		}));
	};

	return (
		<div className="typologiesTable">
			{deleteTypology.status === 'FAIL' && (
				<div ref={infoBoxRef} className="info-box-container">
					<InfoBox
						type="error"
						message={resolveApiErrorMessage(deleteTypology.error, t)}
					/>
				</div>
			)}
			{status === 'SUCCESS' && (
				<Table
					rowData={formatDataToDisplay(data ?? [])}
					tableHeader={header}
					labelData={label}
					columnsOrder={order}
					rowsPerPage={20}
					isCollapsabile={false}
					onEdit={handleEdit}
					onDelete={handleDelete}
					showEmptyCell={false}
					rawData={data}
					manualFilter={false}
					rowKey="code"
					headerActions={headerActions}
				/>
			)}
			{status === 'SUCCESS_EMPTY' && (
				<>
					{headerActions && (
						<div className="header">
							<div className="headerActions">{headerActions}</div>
						</div>
					)}
					<InfoBox type="info" message={t('common.emptydata')} />
				</>
			)}
			{status === 'LOADING' && (
				<div className="center">
					<CircularProgress />
				</div>
			)}
			{status === 'FAIL' && (
				<>
					{headerActions && (
						<div className="header">
							<div className="headerActions">{headerActions}</div>
						</div>
					)}
					<InfoBox
						type="error"
						message={resolveApiErrorMessage(error, t)}
					/>
				</>
			)}
			<ConfirmationDialog
				isOpen={deleteTypology.status === 'SUCCESS'}
				title={t('common.deleted')}
				icon={checkIcon}
				info={t('common.deletedSuccessfully')}
				primaryButtonLabel="Ok"
				handlePrimaryButtonClick={() => {
					dispatch(deleteTypologyReset());
				}}
				handleSecondaryButtonClick={() => ({})}
			/>
		</div>
	);
};

export default TypologiesTable;
