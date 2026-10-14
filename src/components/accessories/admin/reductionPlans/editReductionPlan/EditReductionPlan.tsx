import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate, useParams } from 'react-router';
import { AdminActivityContent } from '~/components/activities/adminActivity';
import { useAppDispatch, useAppSelector } from '~/libraries/hooks/redux';
import { PATHS } from '../../../../../consts';
import type { ReductionPlanDTO } from '../../../../../generated';
import {
	getReductionPlan,
	getReductionPlanReset,
	updateReductionPlan,
	updateReductionPlanReset,
} from '../../../../../state/reductionPlans';
import { getInitialFields } from '../reductionPlanForm/consts';
import ReductionPlanForm from '../reductionPlanForm/ReductionPlanForm';

export const EditReductionPlan = () => {
	const dispatch = useAppDispatch();
	const { t } = useTranslation();
	const { state }: { state: ReductionPlanDTO | undefined } = useLocation();
	const { id } = useParams();
	const navigate = useNavigate();
	const update = useAppSelector((state) => state.reductionPlans.update);
	const selectedPlan = useAppSelector(
		(state) => state.reductionPlans.selectedReductionPlan.data,
	);

	useEffect(() => {
		dispatch(updateReductionPlanReset());
		if (id) {
			dispatch(getReductionPlan(Number(id)));
		}
		return () => {
			dispatch(getReductionPlanReset());
			dispatch(updateReductionPlanReset());
		};
	}, [dispatch, id]);

	const currentPlan = selectedPlan ?? state;
	const formKey = selectedPlan
		? `plan-${selectedPlan.id}-${selectedPlan.lock ?? 0}`
		: (state ? `state-${state.id}-${state.lock ?? 0}` : `empty-${id}`);

	useEffect(() => {
		if (!id || (state && state.id !== Number(id))) {
			navigate(PATHS.admin_reductionplans);
		}
	}, [id, navigate, state]);

	const handleSubmit = (value: ReductionPlanDTO) => {
		dispatch(updateReductionPlan(value));
	};

	return (
		<AdminActivityContent title={t('reductionPlan.editReductionPlan')}>
			<ReductionPlanForm
				key={formKey}
				creationMode={false}
				initialPlan={currentPlan}
				onSubmit={handleSubmit}
				isLoading={!!update.isLoading}
				resetButtonLabel={t('common.reset')}
				submitButtonLabel={t('reductionPlan.updateReductionPlan')}
				fields={getInitialFields(currentPlan)}
			/>
		</AdminActivityContent>
	);
};

export default EditReductionPlan;
