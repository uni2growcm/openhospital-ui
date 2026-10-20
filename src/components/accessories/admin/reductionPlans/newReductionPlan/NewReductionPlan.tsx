import { useTranslation } from 'react-i18next';
import { AdminActivityContent } from '~/components/activities/adminActivity';
import { useAppDispatch, useAppSelector } from '~/libraries/hooks/redux';
import type { ReductionPlanDTO } from '../../../../../generated';
import { createReductionPlan } from '../../../../../state/reductionPlans';
import { getInitialFields } from '../reductionPlanForm/consts';
import ReductionPlanForm from '../reductionPlanForm/ReductionPlanForm';

export const NewReductionPlan = () => {
	const dispatch = useAppDispatch();
	const { t } = useTranslation();
	const create = useAppSelector((state) => state.reductionPlans.create);

	const handleSubmit = (value: ReductionPlanDTO) => {
		dispatch(createReductionPlan(value));
	};

	return (
		<AdminActivityContent title={t('reductionPlan.addNewReductionPlan')}>
			<ReductionPlanForm
				creationMode
				onSubmit={handleSubmit}
				isLoading={!!create.isLoading}
				resetButtonLabel={t('common.reset')}
				submitButtonLabel={t('reductionPlan.saveReductionPlan')}
				fields={getInitialFields(undefined)}
			/>
		</AdminActivityContent>
	);
};

export default NewReductionPlan;
