import type { ArticleFamilyDTO } from '../../../../../generated';
import type { TFields } from '../../../../../libraries/formDataHandling/types';
import type { ArticleFamilyFormFieldName } from './types';

export const getInitialFields: (
	articleFamily: ArticleFamilyDTO | undefined,
) => TFields<ArticleFamilyFormFieldName> = (articleFamily) => ({
	id: { type: 'number', value: `${articleFamily?.id ?? ''}` },
	code: { type: 'text', value: articleFamily?.code ?? '' },
	description: { type: 'text', value: articleFamily?.description ?? '' },
	lock: { type: 'number', value: `${articleFamily?.lock ?? 0}` },
});
