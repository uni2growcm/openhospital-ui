import type { PriceListDTO } from '../../../../../generated';
import type { TFields } from '../../../../../libraries/formDataHandling/types';

export interface IPriceListFormProps {
	fields: TFields<PriceListFormFieldName>;
	onSubmit: (priceList: PriceListDTO) => void;
	creationMode: boolean;
	submitButtonLabel: string;
	resetButtonLabel: string;
	isLoading: boolean;
}

export type PriceListFormFieldName =
	| 'code'
	| 'name'
	| 'description'
	| 'currency';
