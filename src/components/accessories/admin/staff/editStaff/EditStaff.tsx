import { Navigate, useLocation, useParams } from 'react-router';
import { AdminActivityContent } from '~/components/activities/adminActivity';
import { useTranslation } from '~/libraries/hooks';
import { useAppDispatch, useAppSelector } from '~/libraries/hooks/redux';
import { PATHS } from '../../../../../consts';
import type { StaffDTO } from '../../../../../generated';
import { updateStaff } from '../../../../../state/staff';
import { getInitialFields } from '../staffForm/consts';
import StaffForm from '../staffForm/StaffForm';

export const EditStaff = () => {
	const dispatch = useAppDispatch();
	const { t } = useTranslation();
	const { state }: { state: StaffDTO | undefined } = useLocation();
	const { id } = useParams();
	const update = useAppSelector((state) => state.staff.update);

	const handleSubmit = (value: StaffDTO) => {
		dispatch(updateStaff({ ...value, code: state?.code, lock: state?.lock }));
	};

	if (state?.code?.toString() !== id?.toString()) {
		return <Navigate to={PATHS.admin_staff} />;
	}

	return (
		<AdminActivityContent title={t('staff.updateStaff')}>
			<StaffForm
				creationMode={false}
				onSubmit={handleSubmit}
				isLoading={!!update.isLoading}
				resetButtonLabel={t('common.reset')}
				submitButtonLabel={t('staff.updateStaff')}
				fields={getInitialFields(state)}
			/>
		</AdminActivityContent>
	);
};
