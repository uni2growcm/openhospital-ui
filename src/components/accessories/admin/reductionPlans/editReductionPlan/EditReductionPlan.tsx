import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate, useParams } from 'react-router';
import { AdminActivityContent } from '~/components/activities/adminActivity';
import { useAppDispatch, useAppSelector } from '~/libraries/hooks/redux';
import { PATHS } from '../../../../../consts';
import type { ReductionPlanDTO } from '../../../../../generated';
import {
	getReductionPlan,
	updateReductionPlan,
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
		if (id) {
			dispatch(getReductionPlan(Number(id)));
		}
	}, [dispatch, id]);

	const currentPlan = selectedPlan ?? state;

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
				key={currentPlan?.id ?? id}
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
