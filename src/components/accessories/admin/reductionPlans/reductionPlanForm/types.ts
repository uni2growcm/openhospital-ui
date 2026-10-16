import type { ReductionPlanDTO } from '../../../../../generated';
import type { TFields } from '../../../../../libraries/formDataHandling/types';

export type ReductionPlanFormFieldName =
	| 'id'
	| 'description'
	| 'medicalRate'
	| 'examRate'
	| 'operationRate'
	| 'otherRate';

export interface IReductionPlanFormProps {
	fields: TFields<ReductionPlanFormFieldName>;
	initialPlan?: ReductionPlanDTO;
	onSubmit: (values: ReductionPlanDTO) => void;
	creationMode: boolean;
	submitButtonLabel: string;
	resetButtonLabel: string;
	isLoading?: boolean;
}
