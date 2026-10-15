import type { StaffDTO } from '../../../../../generated';
import type { TFields } from '../../../../../libraries/formDataHandling/types';
import type { StaffFormFieldName } from '.';

export const getInitialFields: (
	staff: StaffDTO | undefined,
) => TFields<StaffFormFieldName> = (staff) => ({
	firstName: { type: 'text', value: staff?.firstName ?? '' },
	lastName: { type: 'text', value: staff?.lastName ?? '' },
	profession: { type: 'text', value: staff?.profession ?? '' },
	position: { type: 'text', value: staff?.position ?? '' },
	phone: { type: 'text', value: staff?.phone ?? '' },
});
