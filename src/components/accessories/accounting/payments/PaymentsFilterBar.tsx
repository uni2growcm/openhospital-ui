import { RestartAlt, Search } from '@mui/icons-material';
import { useFormik } from 'formik';
import { get, has } from 'lodash';
import type React from 'react';
import { type FC, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { object, string } from 'yup';
import type { PatientDTO } from '../../../../generated';
import { differenceInDays } from '../../../../libraries/formDataHandling/functions';
import DateField from '../../dateField/DateField';
import PatientPicker from '../../patientPicker/PatientPicker';
import SelectField from '../../selectField/SelectField';
import { getDefaultFilterValues } from './consts';
import classes from './PaymentsFilterBar.module.scss';
import type { IPaymentsFilterBarProps, TPaymentsFilterValues } from './types';

export const PaymentsFilterBar: FC<IPaymentsFilterBarProps> = ({
	initialValues,
	users,
	isLoading,
	onSubmit,
}) => {
	const { t } = useTranslation();

	const validationSchema = object({
		fromDate: string().required(),
		toDate: string().test({
			name: 'toDate',
			message: t('bill.validatetodate'),
			test: function (value) {
				return (
					differenceInDays(
						new Date(this.parent.fromDate),
						new Date(value ?? Date.now()),
					) >= 0
				);
			},
		}),
	});

	const formik = useFormik<TPaymentsFilterValues>({
		initialValues,
		validationSchema,
		enableReinitialize: false,
		onSubmit: (values) => onSubmit(values),
	});

	const { setFieldValue, handleBlur } = formik;

	const dateFieldHandleOnChange = useCallback(
		(fieldName: 'fromDate' | 'toDate') => (value: Date | null) => {
			setFieldValue(fieldName, value ? value.toISOString() : '');
		},
		[setFieldValue],
	);

	const patientHandleOnBlur = useCallback(
		(e: React.FocusEvent<HTMLInputElement>, value: PatientDTO | undefined) => {
			handleBlur(e);
			setFieldValue('patientCode', value?.code ?? '');
		},
		[setFieldValue, handleBlur],
	);

	const userOptions = useMemo(
		() => [
			{ value: '', label: t('accounting.payments.allUsers') },
			...users.map((user) => ({ value: user, label: user })),
		],
		[users, t],
	);

	const handleReset = useCallback(() => {
		const defaultValues = getDefaultFilterValues();
		formik.resetForm({ values: defaultValues });
		onSubmit(defaultValues);
	}, [formik, onSubmit]);

	const isValid = (fieldName: string): boolean => {
		return has(formik.touched, fieldName) && has(formik.errors, fieldName);
	};

	const getErrorText = (fieldName: string): string => {
		return has(formik.touched, fieldName)
			? (get(formik.errors, fieldName) as string)
			: '';
	};

	return (
		<form
			data-cy="payments-filter-bar"
			className={classes.filterBar}
			onSubmit={formik.handleSubmit}
		>
			<div className={classes.filterItem}>
				<DateField
					theme="regular"
					fieldName="fromDate"
					fieldValue={formik.values.fromDate}
					disableFuture={false}
					format="dd/MM/yyyy"
					isValid={isValid('fromDate')}
					errorText={getErrorText('fromDate')}
					label={t('accounting.payments.from')}
					onChange={dateFieldHandleOnChange('fromDate')}
				/>
			</div>
			<div className={classes.filterItem}>
				<DateField
					theme="regular"
					fieldName="toDate"
					fieldValue={formik.values.toDate}
					disableFuture={false}
					format="dd/MM/yyyy"
					isValid={isValid('toDate')}
					errorText={getErrorText('toDate')}
					label={t('accounting.payments.to')}
					onChange={dateFieldHandleOnChange('toDate')}
				/>
			</div>
			<div className={classes.filterItem}>
				<PatientPicker
					theme="regular"
					fieldName="patientCode"
					fieldValue={
						typeof formik.values.patientCode === 'number'
							? formik.values.patientCode
							: 0
					}
					label={t('accounting.payments.patient')}
					isValid={isValid('patientCode')}
					errorText={getErrorText('patientCode')}
					onBlur={patientHandleOnBlur}
				/>
			</div>
			<div className={classes.filterItem}>
				<SelectField
					fieldName="user"
					fieldValue={formik.values.user}
					label={t('accounting.payments.receivedBy')}
					isValid={isValid('user')}
					errorText={getErrorText('user')}
					onBlur={handleBlur}
					onChange={(value) => setFieldValue('user', value)}
					options={userOptions}
					translateOptions={false}
					displayEmpty
				/>
			</div>
			<div className={classes.filterItem}>
				<div className={classes.buttonGroup}>
					<button
						type="submit"
						data-cy="payments-search-button"
						className={classes.searchButton}
						disabled={isLoading}
					>
						<Search />
						<span>{t('accounting.payments.search')}</span>
					</button>
					<button
						type="button"
						data-cy="payments-reset-button"
						className={classes.resetButton}
						disabled={isLoading}
						onClick={handleReset}
					>
						<RestartAlt />
						<span>{t('accounting.payments.reset')}</span>
					</button>
				</div>
			</div>
		</form>
	);
};

export default PaymentsFilterBar;
