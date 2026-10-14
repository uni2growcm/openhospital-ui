import type { PriceListDTO } from '../../../../../generated';
import type { TFields } from '../../../../../libraries/formDataHandling/types';
import type { PriceListFormFieldName } from '.';

export const getInitialFields: (
	priceList: PriceListDTO | undefined,
) => TFields<PriceListFormFieldName> = (priceList) => ({
	code: { type: 'text', value: priceList?.code ?? '' },
	name: { type: 'text', value: priceList?.name ?? '' },
	description: { type: 'text', value: priceList?.description ?? '' },
	currency: { type: 'text', value: priceList?.currency ?? '' },
});
