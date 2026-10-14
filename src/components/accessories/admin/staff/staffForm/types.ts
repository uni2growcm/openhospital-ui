import type { StaffDTO } from '../../../../../generated';
import type { TFields } from '../../../../../libraries/formDataHandling/types';

export interface IStaffProps {
	fields: TFields<StaffFormFieldName>;
	onSubmit: (staff: StaffDTO) => void;
	creationMode: boolean;
	submitButtonLabel: string;
	resetButtonLabel: string;
	isLoading: boolean;
}

export type StaffFormFieldName =
	| 'firstName'
	| 'lastName'
	| 'profession'
	| 'position'
	| 'phone';
