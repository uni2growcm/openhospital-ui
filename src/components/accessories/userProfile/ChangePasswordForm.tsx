import { useFormik } from 'formik';
import { get, has } from 'lodash';
import { type FunctionComponent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import checkIcon from '../../../assets/check-icon.png';
import { useAppDispatch, useAppSelector } from '../../../libraries/hooks/redux';
import { updatePassword, updatePasswordReset } from '../../../state/users';
import Button from '../button/Button';
import ConfirmationDialog from '../confirmationDialog/ConfirmationDialog';
import InfoBox from '../infoBox/InfoBox';
import PasswordField from '../passwordField/PasswordField';
import './styles.scss';
import type { IChangePasswordFormProps, IChangePasswordValues } from './types';
import { changePasswordSchema } from './validation';

export const ChangePasswordForm: FunctionComponent<
	IChangePasswordFormProps
> = ({ userName }) => {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();
	const [openSuccessDialog, setOpenSuccessDialog] = useState(false);

	const status = useAppSelector(
		(state) => state.users.updatePassword.status ?? 'IDLE',
	);
	const error = useAppSelector((state) => state.users.updatePassword.error);

	const formik = useFormik<IChangePasswordValues>({
		initialValues: {
			oldPasswd: '',
			newPasswd: '',
			confirmPasswd: '',
		},
		validationSchema: changePasswordSchema(t),
		onSubmit: (values) => {
			dispatch(
				updatePassword({
					username: userName,
					oldPasswd: values.oldPasswd,
					newPasswd: values.newPasswd,
				}),
			);
		},
	});

	const { handleSubmit, handleBlur, getFieldProps, touched, errors, dirty } =
		formik;

	useEffect(() => {
		if (status === 'SUCCESS') {
			setOpenSuccessDialog(true);
		}
	}, [status]);

	useEffect(
		() => () => {
			dispatch(updatePasswordReset());
		},
		[dispatch],
	);

	const handleDialogClose = () => {
		setOpenSuccessDialog(false);
		formik.resetForm();
		dispatch(updatePasswordReset());
	};

	const isValid = (fieldName: keyof IChangePasswordValues) =>
		!!touched[fieldName] && !!errors[fieldName];

	const getErrorText = (fieldName: keyof IChangePasswordValues) =>
		has(touched, fieldName) ? get(errors, fieldName) : '';

	return (
		<section className="userProfileSection" data-cy="user-profile-password">
			<div className="userProfileSection__header">
				<h3>{t('profile.password')}</h3>
				<p>{t('profile.passwordDescription')}</p>
			</div>
			<form className="userProfileForm" onSubmit={handleSubmit}>
				<div className="userProfileForm__fields">
					<PasswordField
						field={getFieldProps('oldPasswd')}
						label={t('profile.oldPassword')}
						isValid={isValid('oldPasswd')}
						errorText={getErrorText('oldPasswd')}
						onBlur={handleBlur}
					/>
					<PasswordField
						field={getFieldProps('newPasswd')}
						label={t('profile.newPassword')}
						isValid={isValid('newPasswd')}
						errorText={getErrorText('newPasswd')}
						onBlur={handleBlur}
					/>
					<PasswordField
						field={getFieldProps('confirmPasswd')}
						label={t('profile.confirmPassword')}
						isValid={isValid('confirmPasswd')}
						errorText={getErrorText('confirmPasswd')}
						onBlur={handleBlur}
					/>
				</div>
				{status === 'FAIL' && (
					<InfoBox
						type="error"
						message={error?.message ?? t('common.somethingwrong')}
					/>
				)}
				<div className="userProfileForm__actions">
					<Button
						dataCy="update-password"
						type="submit"
						variant="contained"
						disabled={status === 'LOADING' || !dirty}
					>
						{t('profile.savePassword')}
					</Button>
				</div>
			</form>
			<ConfirmationDialog
				isOpen={openSuccessDialog}
				title={t('profile.passwordUpdatedTitle')}
				icon={checkIcon}
				info={t('profile.passwordUpdatedMessage')}
				primaryButtonLabel={t('common.ok')}
				handlePrimaryButtonClick={handleDialogClose}
				handleSecondaryButtonClick={handleDialogClose}
			/>
		</section>
	);
};
