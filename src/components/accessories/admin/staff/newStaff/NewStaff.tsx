import { AdminActivityContent } from '~/components/activities/adminActivity';
import { useTranslation } from '~/libraries/hooks';
import { useAppDispatch, useAppSelector } from '~/libraries/hooks/redux';
import type { StaffDTO } from '../../../../../generated';
import { createStaff } from '../../../../../state/staff';
import { getInitialFields } from '../staffForm/consts';
import StaffForm from '../staffForm/StaffForm';

export const NewStaff = () => {
	const dispatch = useAppDispatch();
	const { t } = useTranslation();
	const create = useAppSelector((state) => state.staff.create);

	const handleSubmit = (value: StaffDTO) => {
		dispatch(createStaff(value));
	};

	return (
		<AdminActivityContent title={t('staff.addStaff')}>
			<StaffForm
				creationMode
				onSubmit={handleSubmit}
				isLoading={!!create.isLoading}
				resetButtonLabel={t('common.reset')}
				submitButtonLabel={t('staff.saveStaff')}
				fields={getInitialFields(undefined)}
			/>
		</AdminActivityContent>
	);
};
