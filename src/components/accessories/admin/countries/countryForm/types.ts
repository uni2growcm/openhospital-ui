import type { CountryDTO } from '../../../../../generated';
import type { TFields } from '../../../../../libraries/formDataHandling/types';

export interface ICountryFormProps {
	fields: TFields<CountryFormFieldName>;
	onSubmit: (country: CountryDTO) => void;
	creationMode: boolean;
	submitButtonLabel: string;
	resetButtonLabel: string;
	isLoading: boolean;
}

export type CountryFormFieldName =
	| 'id'
	| 'isoCode'
	| 'name'
	| 'phoneCode'
	| 'lock';
