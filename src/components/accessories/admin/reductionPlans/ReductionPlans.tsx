import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { AdminActivityContent } from '~/components/activities/adminActivity';
import { useAppDispatch } from '~/libraries/hooks/redux';
import { deleteReductionPlan } from '~/state/reductionPlans';
import { PATHS } from '../../../../consts';
import type { ReductionPlanDTO } from '../../../../generated';
import Button from '../../button/Button';
import classes from './ReductionPlans.module.scss';
import ReductionPlansTable from './reductionPlansTable';

export const ReductionPlans = () => {
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const { t } = useTranslation();

	const handleEdit = (row: ReductionPlanDTO) => {
		navigate(PATHS.admin_reductionplans_edit.replace(':id', `${row.id}`), {
			state: row,
		});
	};

	const handleDelete = (row: ReductionPlanDTO) => {
		if (row.id != null) {
			dispatch(deleteReductionPlan(row.id));
		}
	};

	return (
		<AdminActivityContent title={t('nav.reductionPlans')}>
			<div
				className={classes.reductionPlans}
				data-cy="reduction-plans-activity"
			>
				<ReductionPlansTable
					onEdit={handleEdit}
					onDelete={handleDelete}
					headerActions={
						<Button
							onClick={() => {
								navigate(PATHS.admin_reductionplans_new);
							}}
							type="button"
							variant="contained"
							color="primary"
							dataCy="add-new-reductionplan"
						>
							{t('reductionPlan.addReductionPlan')}
						</Button>
					}
				/>
			</div>
		</AdminActivityContent>
	);
};

export default ReductionPlans;
