import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { AdminActivityContent } from '~/components/activities/adminActivity';
import { useAppDispatch } from '~/libraries/hooks/redux';
import { PATHS } from '../../../../consts';
import type { StaffDTO } from '../../../../generated';
import { deleteStaff, deleteStaffReset } from '../../../../state/staff';
import Button from '../../button/Button';
import classes from './Staff.module.scss';
import StaffTable from './staffTable';

export const Staff = () => {
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const { t } = useTranslation();

	useEffect(() => {
		return () => {
			dispatch(deleteStaffReset());
		};
	}, [dispatch]);

	const handleEdit = (row: StaffDTO) => {
		navigate(PATHS.admin_staff_edit.replace(':id', `${row.code ?? ''}`), {
			state: row,
		});
	};

	const handleDelete = (row: StaffDTO) => {
		dispatch(deleteStaff(row.code ?? 0));
	};

	return (
		<AdminActivityContent title={t('nav.staff')}>
			<div className={classes.staff} data-cy="staff-table">
				<StaffTable
					onEdit={handleEdit}
					onDelete={handleDelete}
					headerActions={
						<Button
							onClick={() => {
								navigate(PATHS.admin_staff_new);
							}}
							type="button"
							variant="contained"
							color="primary"
							dataCy="add-new-staff"
						>
							{t('staff.addStaff')}
						</Button>
					}
				/>
			</div>
		</AdminActivityContent>
	);
};
