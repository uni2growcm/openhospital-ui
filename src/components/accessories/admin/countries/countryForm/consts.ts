import type { CountryDTO } from '../../../../../generated';
import type { TFields } from '../../../../../libraries/formDataHandling/types';
import type { CountryFormFieldName } from './types';

export const getInitialFields: (
	country: CountryDTO | undefined,
) => TFields<CountryFormFieldName> = (country) => ({
	id: { type: 'number', value: `${country?.id ?? ''}` },
	isoCode: { type: 'text', value: country?.isoCode ?? '' },
	name: { type: 'text', value: country?.name ?? '' },
	phoneCode: { type: 'text', value: country?.phoneCode ?? '' },
	lock: { type: 'number', value: `${country?.lock ?? 0}` },
});
