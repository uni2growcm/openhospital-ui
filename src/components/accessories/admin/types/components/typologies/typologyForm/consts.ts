import type { TypologyDTO } from '../../../../../../../generated';
import type { TFields } from '../../../../../../../libraries/formDataHandling/types';
import type { TypologyFormFieldName } from './types';

export const getInitialFields: (
	typology: TypologyDTO | undefined,
) => TFields<TypologyFormFieldName> = (typology) => ({
	code: { type: 'text', value: typology?.code ?? '' },
	description: { type: 'text', value: typology?.description ?? '' },
});
