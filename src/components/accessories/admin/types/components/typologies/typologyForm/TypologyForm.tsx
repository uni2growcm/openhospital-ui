import { useFormik } from 'formik';
import { get, has } from 'lodash';
import { type FC, useCallback, useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { object, string } from 'yup';
import DiscardButton from '~/components/accessories/discardButton/DiscardButton';
import ResetButton from '~/components/accessories/resetButton/resetButton';
import { useAppDispatch, useAppSelector } from '~/libraries/hooks/redux';
import checkIcon from '../../../../../../../assets/check-icon.png';
import {
	formatAllFieldValues,
	getFromFields,
} from '../../../../../../../libraries/formDataHandling/functions';
import {
	createTypologyReset,
	updateTypologyReset,
} from '../../../../../../../state/types/typologies';
import Button from '../../../../../button/Button';
import ConfirmationDialog from '../../../../../confirmationDialog/ConfirmationDialog';
import InfoBox from '../../../../../infoBox/InfoBox';
import TextField from '../../../../../textField/TextField';
import './styles.scss';
import type { ITypologyFormProps } from './types';

const TypologyForm: FC<ITypologyFormProps> = ({
	fields,
	onSubmit,
	creationMode,
	submitButtonLabel,
	resetButtonLabel,
	isLoading,
	family,
	onSuccessPath,
	typeName,
}) => {
	const dispatch = useAppDispatch();
	const { t } = useTranslation();
	const navigate = useNavigate();
	const infoBoxRef = useRef<HTMLDivElement>(null);

	const typologiesStore = useAppSelector((state) => state.types.typologies);

	const errorMessage = useMemo(() => {
		const rawErr = creationMode
			? typologiesStore.create.error
			: typologiesStore.update.error;

		if (!rawErr) return t('common.somethingwrong');

		let msg = t('common.somethingwrong');
		if (typeof rawErr === 'string') msg = rawErr;
		else if (rawErr.response?.data?.message) msg = rawErr.response.data.message;
		else if (rawErr.response?.message) msg = rawErr.response.message;
		else if (rawErr.data?.message) msg = rawErr.data.message;
		else if (rawErr.message && rawErr.message !== 'ajax error') msg = rawErr.message;
		else if (rawErr.error) msg = rawErr.error;

		return t(msg);
	}, [creationMode, t, typologiesStore.create.error, typologiesStore.update.error]);

	const initialValues = getFromFields(fields, 'value');

	const validationSchema = object({
		code: string()
			.max(20, t('validations.maxLength', { max: 20 }))
			.required(t('common.required')),
		description: string()
			.max(255, t('validations.maxLength', { max: 255 }))
			.required(t('common.required')),
	});

	const formik = useFormik({
		initialValues,
		validationSchema,
		enableReinitialize: true,
		onSubmit: (values) => {
			const formattedValues = formatAllFieldValues(fields, values);
			onSubmit({
				code: formattedValues.code,
				description: formattedValues.description,
				family,
			});
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
			dispatch(createTypologyReset());
		} else {
			dispatch(updateTypologyReset());
		}
	}, [creationMode, dispatch]);

	useEffect(() => {
		return cleanUp;
	}, [cleanUp]);

	return (
		<div className="typologyForm">
			<div className="formInsertMode">
				<DiscardButton />
			</div>
			<form className="typologyForm__form" onSubmit={formik.handleSubmit}>
				<div className="row start-sm center-xs">
					<div className="typologyForm__item halfWidth">
						<TextField
							field={formik.getFieldProps('code')}
							theme="regular"
							label={t('common.code')}
							isValid={isValid('code')}
							errorText={getErrorText('code')}
							onBlur={formik.handleBlur}
							type="text"
							disabled={isLoading || !creationMode}
						/>
					</div>
					<div className="typologyForm__item halfWidth">
						<TextField
							field={formik.getFieldProps('description')}
							theme="regular"
							label={t('common.description')}
							isValid={isValid('description')}
							errorText={getErrorText('description')}
							onBlur={formik.handleBlur}
							type="text"
							disabled={isLoading}
						/>
					</div>
				</div>

				<div className="typologyForm__buttonSet">
					<div className="submit_button">
						<Button
							type="submit"
							variant="contained"
							dataCy="submit-form"
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
					? typologiesStore.create.status === 'FAIL'
					: typologiesStore.update.status === 'FAIL') && (
					<div ref={infoBoxRef} className="info-box-container">
						<InfoBox type="error" message={errorMessage} />
					</div>
				)}
				<ConfirmationDialog
					isOpen={
						!!(creationMode
							? typologiesStore.create.hasSucceeded
							: typologiesStore.update.hasSucceeded)
					}
					title={
						creationMode
							? t('common.typeCreated', { type: typeName ?? '' })
							: t('common.typeUpdated', { type: typeName ?? '' })
					}
					icon={checkIcon}
					info={
						creationMode
							? t('common.typeCreateSuccess', { type: typeName ?? '' })
							: t('common.typeUpdateSuccess', { type: typeName ?? '' })
					}
					primaryButtonLabel="Ok"
					handlePrimaryButtonClick={() => {
						navigate(onSuccessPath, { replace: true });
					}}
					handleSecondaryButtonClick={() => ({})}
				/>
			</form>
		</div>
	);
};

export default TypologyForm;
