import { CircularProgress, TextField } from '@mui/material';
import moment from 'moment';
import { type FC, useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import AutocompleteField from '~/components/accessories/autocompleteField/AutocompleteField';
import Button from '~/components/accessories/button/Button';
import { CustomDialog } from '~/components/accessories/customDialog/CustomDialog';
import DateField from '~/components/accessories/dateField/DateField';
import InfoBox from '~/components/accessories/infoBox/InfoBox';
import SelectField from '~/components/accessories/selectField/SelectField';
import { useAppDispatch, useAppSelector } from '~/libraries/hooks/redux';
import { getMedicals } from '~/state/medicals';
import { printReport, printReportReset } from '~/state/reports';
import { getMedicalTypes } from '~/state/types/medicals';
import { getUsers } from '~/state/users';
import { getWards } from '~/state/wards';
import {
	API_DATE_FORMAT,
	defaultReportValues,
	type IReportDefinition,
	reportFileName,
	type TReportFormat,
	type TReportParam,
	type TReportValues,
} from './catalog';
import './styles.scss';

type IOwnProps = {
	report: IReportDefinition;
	/** Action chosen in the list: only the matching button is shown */
	format: TReportFormat;
	open: boolean;
	onClose: () => void;
	onPrinted: (blob: Blob, format: TReportFormat, fileName: string) => void;
};

const YEARS_COUNT = 20;

const toApiDate = (date: Date | null) =>
	date && moment(date).isValid() ? moment(date).format(API_DATE_FORMAT) : '';

const dialogDataCy = (params: TReportParam[]) => {
	if (params.includes('dateRange')) return 'report-date-range-dialog';
	if (params.includes('monthYear')) return 'report-month-year-dialog';
	return 'report-parameters-dialog';
};

export const ReportParametersDialog: FC<IOwnProps> = ({
	report,
	format,
	open,
	onClose,
	onPrinted,
}) => {
	const { t, i18n } = useTranslation();
	const dispatch = useAppDispatch();
	const [values, setValues] = useState<TReportValues>(defaultReportValues);
	const [submitted, setSubmitted] = useState(false);
	const [validationError, setValidationError] = useState<string>();

	const printState = useAppSelector((state) => state.reports.print);
	const wards = useAppSelector((state) => state.wards.allWards);
	const medicals = useAppSelector(
		(state) => state.medicals.medicalsOrderByName,
	);
	const medicalTypes = useAppSelector((state) => state.types.medicals.getAll);
	const users = useAppSelector((state) => state.users.userList);

	const has = useCallback(
		(param: TReportParam) => report.params.includes(param),
		[report],
	);
	const isRequired = useCallback(
		(param: TReportParam) => report.required.includes(param),
		[report],
	);

	useEffect(() => {
		if (!open) return;
		setValues(defaultReportValues());
		setSubmitted(false);
		setValidationError(undefined);
		dispatch(printReportReset());
	}, [open, dispatch]);

	// Load the lists needed by the report fields
	useEffect(() => {
		if (!open) return;
		if (has('ward') || has('pharmacyWard')) dispatch(getWards());
		if (has('medical')) dispatch(getMedicals());
		if (has('medicalType')) dispatch(getMedicalTypes());
		if (has('user')) dispatch(getUsers({}));
	}, [open, has, dispatch]);

	const setValue = (key: keyof TReportValues) => (value: string) =>
		setValues((current) => ({ ...current, [key]: value }));

	const errors = useMemo(() => {
		const result: Partial<Record<keyof TReportValues, string>> = {};
		const requireValue = (key: keyof TReportValues) => {
			if (!values[key]) result[key] = t('common.required');
		};
		if (has('dateRange')) {
			requireValue('fromDate');
			requireValue('toDate');
			if (
				values.fromDate &&
				values.toDate &&
				moment(values.fromDate).isAfter(values.toDate)
			) {
				result.fromDate = t('common.datebefore');
			}
		}
		if (has('monthYear')) {
			requireValue('month');
			requireValue('year');
		}
		if (has('date')) requireValue('date');
		if ((has('ward') && isRequired('ward')) || isRequired('pharmacyWard')) {
			requireValue('wardCode');
		}
		if (isRequired('user')) requireValue('user');
		return result;
	}, [values, has, isRequired, t]);

	const isValid = Object.keys(errors).length === 0;
	const isPrinting = printState.status === 'LOADING';

	const errorOf = (key: keyof TReportValues) =>
		submitted ? (errors[key] ?? '') : '';

	const handlePrint = async () => {
		setSubmitted(true);
		const customError = report.validate?.(values, format);
		setValidationError(customError);
		if (!isValid || customError) return;

		try {
			const blob = await dispatch(
				printReport(() => report.print(values, format)),
			).unwrap();
			onPrinted(blob, format, reportFileName(report, values, format));
		} catch {
			// the error is displayed from the store
		}
	};

	const monthOptions = useMemo(
		() =>
			Array.from({ length: 12 }, (_, index) => ({
				value: String(index + 1),
				label: new Date(2000, index, 1).toLocaleString(i18n.language, {
					month: 'long',
				}),
			})),
		[i18n.language],
	);

	const yearOptions = useMemo(() => {
		const currentYear = moment().year();
		return Array.from({ length: YEARS_COUNT }, (_, index) => ({
			value: String(currentYear - index),
			label: String(currentYear - index),
		}));
	}, []);

	const wardOptions = useMemo(() => {
		const list = (wards.data ?? [])
			.filter((ward) => !has('pharmacyWard') || ward.pharmacy)
			.map((ward) => ({ value: ward.code ?? '', label: ward.description }));
		return has('pharmacyWard') && !isRequired('pharmacyWard')
			? [{ value: '', label: t('reports.fields.mainStore') }, ...list]
			: list;
	}, [wards.data, has, isRequired, t]);

	const medicalOptions = useMemo(
		() =>
			(medicals.data ?? []).map((medical) => ({
				value: String(medical.code ?? ''),
				label: medical.description ?? '',
			})),
		[medicals.data],
	);

	const medicalTypeOptions = useMemo(
		() => [
			{ value: '', label: t('common.all') },
			...(medicalTypes.data ?? []).map((type) => ({
				value: type.description,
				label: type.description,
			})),
		],
		[medicalTypes.data, t],
	);

	const userOptions = useMemo(
		() =>
			(users.data ?? []).map((user) => ({
				value: user.userName,
				label: user.desc ? `${user.userName} - ${user.desc}` : user.userName,
			})),
		[users.data],
	);

	const content = (
		<div className="reportDialog" data-cy={dialogDataCy(report.params)}>
			{report.params.length === 0 && (
				<p className="reportDialog__info">{t('reports.noParameters')}</p>
			)}

			{has('dateRange') && (
				<div className="reportDialog__row">
					<div data-cy="report-date-from" className="reportDialog__field">
						<DateField
							fieldName="fromDate"
							fieldValue={values.fromDate}
							disableFuture
							theme="regular"
							format="dd/MM/yyyy"
							label={t('common.from')}
							isValid={!!errorOf('fromDate')}
							errorText={errorOf('fromDate')}
							onChange={(date) => setValue('fromDate')(toApiDate(date))}
						/>
					</div>
					<div data-cy="report-date-to" className="reportDialog__field">
						<DateField
							fieldName="toDate"
							fieldValue={values.toDate}
							disableFuture
							theme="regular"
							format="dd/MM/yyyy"
							label={t('common.to')}
							isValid={!!errorOf('toDate')}
							errorText={errorOf('toDate')}
							onChange={(date) => setValue('toDate')(toApiDate(date))}
						/>
					</div>
				</div>
			)}

			{has('monthYear') && (
				<div className="reportDialog__row">
					<div data-cy="report-month" className="reportDialog__field">
						<SelectField
							fieldName="month"
							fieldValue={values.month}
							label={t('reports.fields.month')}
							options={monthOptions}
							isValid={!!errorOf('month')}
							errorText={errorOf('month')}
							onBlur={() => {}}
							onChange={setValue('month')}
						/>
					</div>
					<div data-cy="report-year" className="reportDialog__field">
						<SelectField
							fieldName="year"
							fieldValue={values.year}
							label={t('reports.fields.year')}
							options={yearOptions}
							isValid={!!errorOf('year')}
							errorText={errorOf('year')}
							onBlur={() => {}}
							onChange={setValue('year')}
						/>
					</div>
				</div>
			)}

			{(has('ward') || has('pharmacyWard')) && (
				<div data-cy="report-ward" className="reportDialog__field">
					<SelectField
						fieldName="wardCode"
						fieldValue={values.wardCode}
						label={t('reports.fields.ward')}
						options={wardOptions}
						isLoading={wards.status === 'LOADING'}
						isValid={!!errorOf('wardCode')}
						errorText={errorOf('wardCode')}
						onBlur={() => {}}
						onChange={setValue('wardCode')}
					/>
				</div>
			)}

			{has('date') && (
				<div data-cy="report-date" className="reportDialog__field">
					<DateField
						fieldName="date"
						fieldValue={values.date}
						disableFuture
						theme="regular"
						format="dd/MM/yyyy"
						label={t('common.date')}
						isValid={!!errorOf('date')}
						errorText={errorOf('date')}
						onChange={(date) => setValue('date')(toApiDate(date))}
					/>
				</div>
			)}

			{has('medical') && (
				<div data-cy="report-medical" className="reportDialog__field">
					<AutocompleteField
						fieldName="medicalCode"
						fieldValue={values.medicalCode}
						label={t('reports.fields.medical')}
						options={medicalOptions}
						isLoading={medicals.status === 'LOADING'}
						isValid={false}
						errorText=""
						onBlur={() => {}}
						onChange={(_e, option) =>
							setValue('medicalCode')(option?.value ? String(option.value) : '')
						}
					/>
					<span className="reportDialog__hint">
						{t('reports.fields.medicalHint')}
					</span>
				</div>
			)}

			{has('medicalType') && (
				<div data-cy="report-medical-type" className="reportDialog__field">
					<SelectField
						fieldName="medicalType"
						fieldValue={values.medicalType}
						label={t('reports.fields.medicalType')}
						options={medicalTypeOptions}
						isLoading={medicalTypes.status === 'LOADING'}
						isValid={false}
						errorText=""
						onBlur={() => {}}
						onChange={setValue('medicalType')}
					/>
				</div>
			)}

			{has('search') && (
				<div data-cy="report-search" className="reportDialog__field">
					<TextField
						size="small"
						fullWidth
						name="search"
						label={t('reports.fields.search')}
						value={values.search}
						onChange={(e) => setValue('search')(e.target.value)}
					/>
				</div>
			)}

			{has('user') && (
				<div data-cy="report-user" className="reportDialog__field">
					<SelectField
						fieldName="user"
						fieldValue={values.user}
						label={t('reports.fields.user')}
						options={userOptions}
						isLoading={users.status === 'LOADING'}
						isValid={!!errorOf('user')}
						errorText={errorOf('user')}
						onBlur={() => {}}
						onChange={setValue('user')}
					/>
				</div>
			)}

			{validationError && (
				<div className="reportDialog__error">
					<InfoBox type="error" message={t(validationError)} />
				</div>
			)}

			{printState.hasFailed && (
				<div className="reportDialog__error">
					<InfoBox
						type="error"
						message={printState.error?.message ?? t('reports.errors.print')}
					/>
				</div>
			)}

			<div className="reportDialog__buttons">
				{format === 'xlsx' ? (
					<Button
						type="button"
						variant="contained"
						color="success"
						dataCy="report-export-excel"
						disabled={isPrinting || (submitted && !isValid)}
						onClick={handlePrint}
					>
						{isPrinting ? (
							<CircularProgress size={18} color="inherit" />
						) : (
							t('reports.actions.excel')
						)}
					</Button>
				) : (
					<Button
						type="button"
						variant="contained"
						dataCy="report-validate"
						disabled={isPrinting || (submitted && !isValid)}
						onClick={handlePrint}
					>
						{isPrinting ? (
							<CircularProgress size={18} color="inherit" />
						) : (
							t('reports.actions.preview')
						)}
					</Button>
				)}
				<Button
					type="button"
					variant="text"
					dataCy="report-cancel"
					disabled={isPrinting}
					onClick={onClose}
				>
					{t('common.cancel')}
				</Button>
			</div>
		</div>
	);

	return (
		<CustomDialog
			title={report.title}
			description={report.code}
			open={open}
			onClose={onClose}
			content={content}
		/>
	);
};
