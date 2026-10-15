import { useFormik } from 'formik';
import { get, has } from 'lodash';
import { type FC, useCallback, useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { object, string } from 'yup';
import DiscardButton from '~/components/accessories/discardButton/DiscardButton';
import ResetButton from '~/components/accessories/resetButton/resetButton';
import { useAppDispatch, useAppSelector } from '~/libraries/hooks/redux';
import { FIELD_VALIDATION } from '~/types';
import checkIcon from '../../../../../assets/check-icon.png';
import { PATHS } from '../../../../../consts';
import {
	formatAllFieldValues,
	getFromFields,
} from '../../../../../libraries/formDataHandling/functions';
import { createStaffReset, updateStaffReset } from '../../../../../state/staff';
import Button from '../../../button/Button';
import ConfirmationDialog from '../../../confirmationDialog/ConfirmationDialog';
import InfoBox from '../../../infoBox/InfoBox';
import TextField from '../../../textField/TextField';
import './styles.scss';
import type { IStaffProps } from './types';

const StaffForm: FC<IStaffProps> = ({
	fields,
	onSubmit,
	creationMode,
	submitButtonLabel,
	resetButtonLabel,
	isLoading,
}) => {
	const dispatch = useAppDispatch();
	const { t } = useTranslation();
	const navigate = useNavigate();
	const infoBoxRef = useRef<HTMLDivElement>(null);

	const staffStore = useAppSelector((state) => state.staff);

	const errorMessage = useMemo(
		() =>
			(creationMode
				? t(staffStore.create.error?.message)
				: t(staffStore.update.error?.message)) ?? t('common.somethingwrong'),
		[
			creationMode,
			t,
			staffStore.create.error?.message,
			staffStore.update.error?.message,
		],
	);

	const initialValues = getFromFields(fields, 'value');

	const validationSchema = object({
		firstName: string().required(t('common.required')),
		lastName: string().required(t('common.required')),
		position: string().required(t('common.required')),
		profession: string(),
		phone: string(),
	});

	const formik = useFormik({
		initialValues,
		validationSchema,
		enableReinitialize: true,
		onSubmit: (values) => {
			const formattedValues = formatAllFieldValues(fields, values);
			onSubmit(formattedValues as any);
		},
	});

	const isValid = (fieldName: string): boolean => {
		return has(formik.touched, fieldName) && has(formik.errors, fieldName);
	};

	const getErrorText = (fieldName: string): string => {
		return has(formik.touched, fieldName)
			? (get(formik.errors, fieldName) as string)
			: '';
	};

	const cleanUp = useCallback(() => {
		if (creationMode) {
			dispatch(createStaffReset());
		} else {
			dispatch(updateStaffReset());
		}
	}, [creationMode, dispatch]);

	useEffect(() => {
		return cleanUp;
	}, [cleanUp]);

	return (
		<div className="staffForm">
			<div className="staffForm__header">
				<div className="staffForm__actions">
					<DiscardButton />
				</div>
			</div>
			<form className="staffForm__form" onSubmit={formik.handleSubmit}>
				<div className="row start-sm center-xs">
					<div className="staffForm__item halfWidth">
						<TextField
							field={formik.getFieldProps('firstName')}
							theme="regular"
							label={t('staff.firstName')}
							isValid={isValid('firstName')}
							errorText={getErrorText('firstName')}
							onBlur={formik.handleBlur}
							type="text"
							disabled={isLoading}
							required={FIELD_VALIDATION.REQUIRED}
						/>
					</div>
					<div className="staffForm__item halfWidth">
						<TextField
							field={formik.getFieldProps('lastName')}
							theme="regular"
							label={t('staff.lastName')}
							isValid={isValid('lastName')}
							errorText={getErrorText('lastName')}
							onBlur={formik.handleBlur}
							type="text"
							disabled={isLoading}
							required={FIELD_VALIDATION.REQUIRED}
						/>
					</div>
				</div>
				<div className="row start-sm center-xs">
					<div className="staffForm__item halfWidth">
						<TextField
							field={formik.getFieldProps('position')}
							theme="regular"
							label={t('staff.position')}
							isValid={isValid('position')}
							errorText={getErrorText('position')}
							onBlur={formik.handleBlur}
							type="text"
							disabled={isLoading}
							required={FIELD_VALIDATION.REQUIRED}
						/>
					</div>
					<div className="staffForm__item halfWidth">
						<TextField
							field={formik.getFieldProps('profession')}
							theme="regular"
							label={t('staff.profession')}
							isValid={isValid('profession')}
							errorText={getErrorText('profession')}
							onBlur={formik.handleBlur}
							type="text"
							disabled={isLoading}
						/>
					</div>
				</div>
				<div className="row start-sm center-xs">
					<div className="staffForm__item halfWidth">
						<TextField
							field={formik.getFieldProps('phone')}
							theme="regular"
							label={t('staff.phone')}
							isValid={isValid('phone')}
							errorText={getErrorText('phone')}
							onBlur={formik.handleBlur}
							type="text"
							disabled={isLoading}
						/>
					</div>
				</div>

				<div className="staffForm__buttonSet">
					<div className="submit_button">
						<Button
							type="submit"
							dataCy="submit-form"
							variant="contained"
							disabled={isLoading}
						>
							{submitButtonLabel}
						</Button>
					</div>
					<div className="reset_button">
						<ResetButton formik={formik as any} title={resetButtonLabel} />
					</div>
				</div>
				{(creationMode
					? staffStore.create.status === 'FAIL'
					: staffStore.update.status === 'FAIL') && (
					<div ref={infoBoxRef} className="info-box-container">
						<InfoBox type="error" message={errorMessage} />
					</div>
				)}
				<ConfirmationDialog
					isOpen={
						!!(creationMode
							? staffStore.create.hasSucceeded
							: staffStore.update.hasSucceeded)
					}
					title={creationMode ? t('staff.created') : t('staff.updated')}
					icon={checkIcon}
					info={
						creationMode
							? t('staff.createSuccess')
							: t('staff.updateSuccess', { code: formik.values.firstName })
					}
					primaryButtonLabel="Ok"
					handlePrimaryButtonClick={() => {
						navigate(PATHS.admin_staff, { replace: true });
					}}
					handleSecondaryButtonClick={() => ({})}
				/>
			</form>
		</div>
	);
};

export default StaffForm;
