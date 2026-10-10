import { useFormik } from 'formik';
import { get, has } from 'lodash';
import { type FC, useCallback, useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { object, string } from 'yup';
import DiscardButton from '~/components/accessories/discardButton/DiscardButton';
import ResetButton from '~/components/accessories/resetButton/resetButton';
import { useAppDispatch, useAppSelector } from '~/libraries/hooks/redux';
import checkIcon from '../../../../../assets/check-icon.png';
import { PATHS } from '../../../../../consts';
import {
	formatAllFieldValues,
	getFromFields,
} from '../../../../../libraries/formDataHandling/functions';
import {
	createCountryReset,
	updateCountryReset,
} from '../../../../../state/countries';
import Button from '../../../button/Button';
import ConfirmationDialog from '../../../confirmationDialog/ConfirmationDialog';
import InfoBox from '../../../infoBox/InfoBox';
import TextField from '../../../textField/TextField';
import './styles.scss';
import type { ICountryFormProps } from './types';

const CountryForm: FC<ICountryFormProps> = ({
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

	const countryStore = useAppSelector((state) => state.countries);

	const errorMessage = useMemo(() => {
		const rawKey = creationMode
			? countryStore.create.error?.message
			: countryStore.update.error?.message;
		return rawKey ? t(rawKey) : t('common.somethingwrong');
	}, [
		creationMode,
		t,
		countryStore.create.error?.message,
		countryStore.update.error?.message,
	]);

	const initialValues = getFromFields(fields, 'value');

	const validationSchema = object({
		id: string().notRequired(),
		lock: string().notRequired(),
		isoCode: string()
			.required(t('common.required'))
			.matches(/^[A-Z]{2}$/, t('country.isoCodeInvalidFormat'))
			.max(2, t('validations.maxLength', { max: 2 })),
		name: string()
			.required(t('common.required'))
			.max(100, t('validations.maxLength', { max: 100 })),
		phoneCode: string()
			.required(t('common.required'))
			.matches(/^[0-9()+]*$/, t('country.phoneCodeInvalidFormat'))
			.max(10, t('validations.maxLength', { max: 10 })),
	});

	const formik = useFormik({
		initialValues,
		validationSchema,
		enableReinitialize: true,
		onSubmit: (values) => {
			const formattedValues = formatAllFieldValues(fields, values);
			if (creationMode) {
				formattedValues.id = 0;
				formattedValues.lock = 0;
			}
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
			dispatch(createCountryReset());
		} else {
			dispatch(updateCountryReset());
		}
	}, [creationMode, dispatch]);

	useEffect(() => {
		return cleanUp;
	}, [cleanUp]);

	const handleIsoCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const upperLettersOnly = e.target.value
			.replace(/[^a-zA-Z]/g, '')
			.slice(0, 2)
			.toUpperCase();
		formik.setFieldValue('isoCode', upperLettersOnly);
	};

	const handlePhoneCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const allowedPhoneChars = e.target.value
			.replace(/[^0-9()+]/g, '')
			.slice(0, 10);
		formik.setFieldValue('phoneCode', allowedPhoneChars);
	};

	return (
		<div className="countryForm">
			<div className="countryForm__header">
				<div className="countryForm__actions">
					<DiscardButton />
				</div>
			</div>
			<form className="countryForm__form" onSubmit={formik.handleSubmit}>
				<div className="row start-sm center-xs">
					<div className="countryForm__item thirdWidth">
						<TextField
							field={{
								...formik.getFieldProps('isoCode'),
								onChange: handleIsoCodeChange,
							}}
							theme="regular"
							label={t('country.isoCode')}
							isValid={isValid('isoCode')}
							errorText={getErrorText('isoCode')}
							onBlur={formik.handleBlur}
							type="text"
							disabled={isLoading}
						/>
					</div>
					<div className="countryForm__item thirdWidth">
						<TextField
							field={formik.getFieldProps('name')}
							theme="regular"
							label={t('country.name')}
							isValid={isValid('name')}
							errorText={getErrorText('name')}
							onBlur={formik.handleBlur}
							type="text"
							disabled={isLoading}
						/>
					</div>
					<div className="countryForm__item thirdWidth">
						<TextField
							field={{
								...formik.getFieldProps('phoneCode'),
								onChange: handlePhoneCodeChange,
							}}
							theme="regular"
							label={t('country.phoneCode')}
							isValid={isValid('phoneCode')}
							errorText={getErrorText('phoneCode')}
							onBlur={formik.handleBlur}
							type="text"
							disabled={isLoading}
						/>
					</div>
				</div>

				<div className="countryForm__buttonSet">
					<div className="submit_button">
						<Button type="submit" variant="contained" disabled={isLoading}>
							{submitButtonLabel}
						</Button>
					</div>
					<div className="reset_button">
						<ResetButton formik={formik as any} title={resetButtonLabel} />
					</div>
				</div>
				{(creationMode
					? countryStore.create.status === 'FAIL'
					: countryStore.update.status === 'FAIL') && (
					<div ref={infoBoxRef} className="info-box-container">
						<InfoBox type="error" message={errorMessage} />
					</div>
				)}
				<ConfirmationDialog
					isOpen={
						!!(creationMode
							? countryStore.create.hasSucceeded
							: countryStore.update.hasSucceeded)
					}
					title={creationMode ? t('country.created') : t('country.updated')}
					icon={checkIcon}
					info={
						creationMode
							? t('country.createSuccess')
							: t('country.updateSuccess')
					}
					primaryButtonLabel="Ok"
					handlePrimaryButtonClick={() => {
						navigate(PATHS.admin_countries, { replace: true });
					}}
					handleSecondaryButtonClick={() => ({})}
				/>
			</form>
		</div>
	);
};

export default CountryForm;
