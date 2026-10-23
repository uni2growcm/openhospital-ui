import type { TypologyDTO } from '../../../../../../../generated';
import type { TFields } from '../../../../../../../libraries/formDataHandling/types';

export interface ITypologyFormProps {
	fields: TFields<TypologyFormFieldName>;
	onSubmit: (typology: TypologyDTO) => void;
	creationMode: boolean;
	submitButtonLabel: string;
	resetButtonLabel: string;
	isLoading: boolean;
	family: TypologyDTO['family'];
	onSuccessPath: string;
	typeName?: string;
}

export type TypologyFormFieldName = 'code' | 'description';
