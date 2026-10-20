import type { ArticleFamilyDTO } from '../../../../../generated';
import type { TFields } from '../../../../../libraries/formDataHandling/types';

export interface IArticleFamilyFormProps {
	fields: TFields<ArticleFamilyFormFieldName>;
	onSubmit: (articleFamily: ArticleFamilyDTO) => void;
	creationMode: boolean;
	submitButtonLabel: string;
	resetButtonLabel: string;
	isLoading: boolean;
}

export type ArticleFamilyFormFieldName = 'id' | 'code' | 'description' | 'lock';
