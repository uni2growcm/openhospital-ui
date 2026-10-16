import type { ReductionPlanDTO } from '../../../../../generated';
import type { TFields } from '../../../../../libraries/formDataHandling/types';
import type { ReductionPlanFormFieldName } from './types';

export const getInitialFields: (
	plan: ReductionPlanDTO | undefined,
) => TFields<ReductionPlanFormFieldName> = (plan) => ({
	id: { type: 'number', value: plan?.id != null ? `${plan.id}` : '' },
	description: { type: 'text', value: plan?.description ?? '' },
	medicalRate: {
		type: 'number',
		value: plan?.medicalRate != null ? `${plan.medicalRate}` : '0',
	},
	examRate: {
		type: 'number',
		value: plan?.examRate != null ? `${plan.examRate}` : '0',
	},
	operationRate: {
		type: 'number',
		value: plan?.operationRate != null ? `${plan.operationRate}` : '0',
	},
	otherRate: {
		type: 'number',
		value: plan?.otherRate != null ? `${plan.otherRate}` : '0',
	},
});
