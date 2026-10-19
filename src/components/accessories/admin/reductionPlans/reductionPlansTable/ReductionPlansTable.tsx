import { CircularProgress } from '@mui/material';
import { type ReactNode, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import ConfirmationDialog from '~/components/accessories/confirmationDialog/ConfirmationDialog';
import { useAppDispatch, useAppSelector } from '~/libraries/hooks/redux';
import checkIcon from '../../../../../assets/check-icon.png';
import type { ReductionPlanDTO } from '../../../../../generated';
import {
	deleteReductionPlanReset,
	getReductionPlans,
} from '../../../../../state/reductionPlans';
import InfoBox from '../../../infoBox/InfoBox';
import type { TFilterField } from '../../../table/filter/types';
import Table from '../../../table/Table';
import classes from './ReductionPlansTable.module.scss';

interface IOwnProps {
	onEdit: (row: any) => void;
	onDelete: (row: any) => void;
	headerActions?: ReactNode;
}

export const ReductionPlansTable = ({
	onEdit,
	onDelete,
	headerActions,
}: IOwnProps) => {
	const dispatch = useAppDispatch();
	const { t } = useTranslation();
	const infoBoxRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		dispatch(getReductionPlans());
	}, [dispatch]);

	const header = [
		'description',
		'medicalRate',
		'examRate',
		'operationRate',
		'otherRate',
	];

	const label = {
		description: t('reductionPlan.description'),
		medicalRate: t('reductionPlan.medicalRate'),
		examRate: t('reductionPlan.examRate'),
		operationRate: t('reductionPlan.operationRate'),
		otherRate: t('reductionPlan.otherRate'),
	};

	const order = [
		'description',
		'medicalRate',
		'examRate',
		'operationRate',
		'otherRate',
	];

	const filters: TFilterField[] = [
		{ key: 'description', label: t('reductionPlan.description'), type: 'text' },
	];

	const { data, status, error } = useAppSelector(
		(state) => state.reductionPlans.reductionPlanList,
	);

	const deleteReductionPlanState = useAppSelector(
		(state) => state.reductionPlans.delete,
	);

	const formatDataToDisplay = (plans: ReductionPlanDTO[]) => {
		return plans.map((item) => ({
			id: item.id,
			description: item.description ?? '',
			medicalRate: `${item.medicalRate ?? 0}%`,
			examRate: `${item.examRate ?? 0}%`,
			operationRate: `${item.operationRate ?? 0}%`,
			otherRate: `${item.otherRate ?? 0}%`,
		}));
	};

	const handleEdit = (row: any) => {
		onEdit((data ?? []).find((item) => item.id === row?.id));
	};

	const handleDelete = (row: any) => {
		const target = (data ?? []).find((item) => item.id === row?.id);
		if (target) {
			onDelete(target);
		}
	};

	return (
		<div className={classes.table}>
			{(() => {
				switch (status) {
					case 'FAIL':
						return (
							<>
								{headerActions && (
									<div className={classes.headerActions}>{headerActions}</div>
								)}
								<InfoBox type="error" message={error?.message} />
							</>
						);
					case 'LOADING':
						return (
							<CircularProgress
								style={{ marginLeft: '50%', position: 'relative' }}
							/>
						);
					case 'SUCCESS':
						if (!data || data.length === 0) {
							return (
								<>
									{headerActions && (
										<div className={classes.headerActions}>{headerActions}</div>
									)}
									<InfoBox type="info" message={t('common.emptydata')} />
								</>
							);
						}
						return (
							<>
								<Table
									rowData={formatDataToDisplay(data ?? [])}
									tableHeader={header}
									labelData={label}
									columnsOrder={order}
									rowsPerPage={10}
									isCollapsabile={false}
									onEdit={handleEdit}
									onDelete={handleDelete}
									filterColumns={filters}
									showEmptyCell={false}
									rowKey="description"
									manualFilter={false}
									headerActions={headerActions}
								/>
								{deleteReductionPlanState.isLoading && (
									<div ref={infoBoxRef} className="info-box-container">
										<InfoBox
											type="info"
											message={t('reductionPlan.deleting')}
										/>
									</div>
								)}
								{deleteReductionPlanState.status === 'FAIL' && (
									<div ref={infoBoxRef} className="info-box-container">
										<InfoBox
											type="error"
											message={
												deleteReductionPlanState.error?.message ||
												t('common.somethingwrong')
											}
										/>
									</div>
								)}
								<ConfirmationDialog
									isOpen={deleteReductionPlanState.status === 'SUCCESS'}
									title={t('reductionPlan.deleted')}
									icon={checkIcon}
									info={t('reductionPlan.deleteSuccess')}
									primaryButtonLabel="Ok"
									handlePrimaryButtonClick={() => {
										dispatch(getReductionPlans());
										dispatch(deleteReductionPlanReset());
									}}
									handleSecondaryButtonClick={() => ({})}
								/>
							</>
						);
					case 'SUCCESS_EMPTY':
						return (
							<>
								{headerActions && (
									<div className={classes.headerActions}>{headerActions}</div>
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

export default ReductionPlansTable;
