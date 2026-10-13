import { Delete } from '@mui/icons-material';
import {
	Autocomplete,
	IconButton,
	Paper,
	Tab,
	Table as MuiTable,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Tabs,
	TextField as MuiTextField,
} from '@mui/material';
import { useFormik } from 'formik';
import { get, has } from 'lodash';
import { type FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { number, object, string } from 'yup';
import DiscardButton from '~/components/accessories/discardButton/DiscardButton';
import ResetButton from '~/components/accessories/resetButton/resetButton';
import { useAppDispatch, useAppSelector } from '~/libraries/hooks/redux';
import checkIcon from '../../../../../assets/check-icon.png';
import { PATHS } from '../../../../../consts';
import type {
	ExamReductionDTO,
	MedicalReductionDTO,
	OperationReductionDTO,
	PriceOtherReductionDTO,
	ReductionPlanDTO,
} from '../../../../../generated';
import {
	formatAllFieldValues,
	getFromFields,
} from '../../../../../libraries/formDataHandling/functions';
import { getExams } from '../../../../../state/exams';
import { getMedicals } from '../../../../../state/medicals';
import { getOperations } from '../../../../../state/operations';
import { getPricesOthers } from '../../../../../state/prices';
import {
	createReductionPlanReset,
	updateReductionPlanReset,
} from '../../../../../state/reductionPlans';
import Button from '../../../button/Button';
import ConfirmationDialog from '../../../confirmationDialog/ConfirmationDialog';
import InfoBox from '../../../infoBox/InfoBox';
import TextField from '../../../textField/TextField';
import './styles.scss';
import type { IReductionPlanFormProps } from './types';

const ReductionPlanForm: FC<IReductionPlanFormProps> = ({
	fields,
	initialPlan,
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

	const reductionPlanStore = useAppSelector((state) => state.reductionPlans);
	const medicalsList = useAppSelector(
		(state) => state.medicals.medicalsOrderByName.data ?? [],
	);
	const examsList = useAppSelector((state) => state.exams.examList.data ?? []);
	const operationsList = useAppSelector(
		(state) => state.operations.operationList.data ?? [],
	);
	const pricesOthersList = useAppSelector(
		(state) => state.prices.getPricesOthers.data ?? [],
	);

	useEffect(() => {
		dispatch(getMedicals());
		dispatch(getExams());
		dispatch(getOperations());
		dispatch(getPricesOthers());
	}, [dispatch]);

	// Specific reductions state
	const [medicalReductions, setMedicalReductions] = useState<
		MedicalReductionDTO[]
	>(initialPlan?.medicalReductions ?? []);
	const [examReductions, setExamReductions] = useState<ExamReductionDTO[]>(
		initialPlan?.examReductions ?? [],
	);
	const [operationReductions, setOperationReductions] = useState<
		OperationReductionDTO[]
	>(initialPlan?.operationReductions ?? []);
	const [priceOtherReductions, setPriceOtherReductions] = useState<
		PriceOtherReductionDTO[]
	>(initialPlan?.priceOtherReductions ?? []);

	const [activeTab, setActiveTab] = useState<number>(0);

	const [selectedMedicalCode, setSelectedMedicalCode] = useState<string>('');
	const [medicalRateInput, setMedicalRateInput] = useState<string>('');

	const [selectedExamCode, setSelectedExamCode] = useState<string>('');
	const [examRateInput, setExamRateInput] = useState<string>('');

	const [selectedOperationCode, setSelectedOperationCode] = useState<string>('');
	const [operationRateInput, setOperationRateInput] = useState<string>('');

	const [selectedOtherId, setSelectedOtherId] = useState<string>('');
	const [otherRateInput, setOtherRateInput] = useState<string>('');

	const errorMessage = useMemo(() => {
		const rawErr = creationMode
			? reductionPlanStore.create.error
			: reductionPlanStore.update.error;

		if (!rawErr) return t('common.somethingwrong');

		let msg = t('common.somethingwrong');
		if (typeof rawErr === 'string') msg = rawErr;
		else if (rawErr.response?.data?.message) msg = rawErr.response.data.message;
		else if (rawErr.response?.message) msg = rawErr.response.message;
		else if (rawErr.data?.message) msg = rawErr.data.message;
		else if (rawErr.message && rawErr.message !== 'ajax error') msg = rawErr.message;
		else if (rawErr.error) msg = rawErr.error;

		return t(msg);
	}, [
		creationMode,
		t,
		reductionPlanStore.create.error,
		reductionPlanStore.update.error,
	]);

	const initialValues = getFromFields(fields, 'value');

	const validationSchema = object({
		id: number().notRequired(),
		description: string().required(t('common.required')),
		medicalRate: number()
			.typeError(t('common.required'))
			.min(0, t('validations.between', { min: 0, max: 100 }))
			.max(100, t('validations.between', { min: 0, max: 100 }))
			.required(t('common.required')),
		examRate: number()
			.typeError(t('common.required'))
			.min(0, t('validations.between', { min: 0, max: 100 }))
			.max(100, t('validations.between', { min: 0, max: 100 }))
			.required(t('common.required')),
		operationRate: number()
			.typeError(t('common.required'))
			.min(0, t('validations.between', { min: 0, max: 100 }))
			.max(100, t('validations.between', { min: 0, max: 100 }))
			.required(t('common.required')),
		otherRate: number()
			.typeError(t('common.required'))
			.min(0, t('validations.between', { min: 0, max: 100 }))
			.max(100, t('validations.between', { min: 0, max: 100 }))
			.required(t('common.required')),
	});

	const formik = useFormik({
		initialValues,
		validationSchema,
		enableReinitialize: true,
		onSubmit: (values) => {
			const formattedValues = formatAllFieldValues(fields, values);
			const payload: ReductionPlanDTO = {
				id: creationMode ? undefined : initialPlan?.id ?? Number(formattedValues.id),
				description: formattedValues.description,
				medicalRate: Number(formattedValues.medicalRate),
				examRate: Number(formattedValues.examRate),
				operationRate: Number(formattedValues.operationRate),
				otherRate: Number(formattedValues.otherRate),
				lock: initialPlan?.lock,
				medicalReductions,
				examReductions,
				operationReductions,
				priceOtherReductions,
			};
			onSubmit(payload);
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
			dispatch(createReductionPlanReset());
		} else {
			dispatch(updateReductionPlanReset());
		}
	}, [creationMode, dispatch]);

	useEffect(() => {
		return cleanUp;
	}, [cleanUp]);

	const handleRateBlur = (fieldName: string) => (e: React.FocusEvent<any>) => {
		formik.handleBlur(e);
		const currentVal = formik.values[fieldName];
		if (currentVal === '' || currentVal === null || currentVal === undefined) {
			const defaultVal = initialValues[fieldName] != null && initialValues[fieldName] !== ''
				? initialValues[fieldName]
				: '0';
			formik.setFieldValue(fieldName, defaultVal);
		}
	};

	const handleAddMedicalReduction = () => {
		const med = medicalsList.find((m) => `${m.code}` === selectedMedicalCode);
		const rate = Number(medicalRateInput);
		if (med && !isNaN(rate) && rate >= 0.01 && rate <= 100) {
			setMedicalReductions((prev) => [
				...prev,
				{ medical: med, reductionRate: rate },
			]);
			setSelectedMedicalCode('');
			setMedicalRateInput('');
		}
	};

	const handleAddExamReduction = () => {
		const ex = examsList.find((e) => e.code === selectedExamCode);
		const rate = Number(examRateInput);
		if (ex && !isNaN(rate) && rate >= 0.01 && rate <= 100) {
			setExamReductions((prev) => [
				...prev,
				{ exam: ex, reductionRate: rate },
			]);
			setSelectedExamCode('');
			setExamRateInput('');
		}
	};

	const handleAddOperationReduction = () => {
		const op = operationsList.find((o) => o.code === selectedOperationCode);
		const rate = Number(operationRateInput);
		if (op && !isNaN(rate) && rate >= 0.01 && rate <= 100) {
			setOperationReductions((prev) => [
				...prev,
				{ operation: op, reductionRate: rate },
			]);
			setSelectedOperationCode('');
			setOperationRateInput('');
		}
	};

	const handleAddOtherReduction = () => {
		const other = pricesOthersList.find((p) => `${p.id}` === selectedOtherId);
		const rate = Number(otherRateInput);
		if (other && !isNaN(rate) && rate >= 0.01 && rate <= 100) {
			setPriceOtherReductions((prev) => [
				...prev,
				{ pricesOthers: other, reductionRate: rate },
			]);
			setSelectedOtherId('');
			setOtherRateInput('');
		}
	};

	const availableMedicals = useMemo(() => {
		const usedCodes = new Set(medicalReductions.map((r) => r.medical.code));
		return medicalsList.filter((m) => !usedCodes.has(m.code));
	}, [medicalsList, medicalReductions]);

	const availableExams = useMemo(() => {
		const usedCodes = new Set(examReductions.map((r) => r.exam.code));
		return examsList.filter((e) => !usedCodes.has(e.code));
	}, [examsList, examReductions]);

	const availableOperations = useMemo(() => {
		const usedCodes = new Set(operationReductions.map((r) => r.operation.code));
		return operationsList.filter((o) => !usedCodes.has(o.code));
	}, [operationsList, operationReductions]);

	const availableOthers = useMemo(() => {
		const usedIds = new Set(priceOtherReductions.map((r) => r.pricesOthers.id));
		return pricesOthersList.filter((p) => !usedIds.has(p.id));
	}, [pricesOthersList, priceOtherReductions]);



	return (
		<div className="reductionPlanForm">
			<form onSubmit={formik.handleSubmit}>
				<div className="reductionPlanForm__header">
					<div className="reductionPlanForm__actions">
						<DiscardButton />
					</div>
				</div>
				<div className="row start-sm center-xs">
					<div className="reductionPlanForm__item fullWidth">
						<TextField
							field={formik.getFieldProps('description')}
							theme="regular"
							label={t('reductionPlan.description')}
							isValid={isValid('description')}
							errorText={getErrorText('description')}
							onBlur={formik.handleBlur}
							type="text"
							disabled={isLoading}
						/>
					</div>
				</div>

				<h3 className="sectionTitle">{t('reductionPlan.generalRates')}</h3>
				<div className="row start-sm center-xs">
					<div className="reductionPlanForm__item quarterWidth">
						<TextField
							field={formik.getFieldProps('medicalRate')}
							theme="regular"
							label={t('reductionPlan.medicalRate')}
							isValid={isValid('medicalRate')}
							errorText={getErrorText('medicalRate')}
							onBlur={handleRateBlur('medicalRate')}
							InputLabelProps={{ shrink: true }}
							type="number"
							disabled={isLoading}
						/>
					</div>
					<div className="reductionPlanForm__item quarterWidth">
						<TextField
							field={formik.getFieldProps('examRate')}
							theme="regular"
							label={t('reductionPlan.examRate')}
							isValid={isValid('examRate')}
							errorText={getErrorText('examRate')}
							onBlur={handleRateBlur('examRate')}
							InputLabelProps={{ shrink: true }}
							type="number"
							disabled={isLoading}
						/>
					</div>
					<div className="reductionPlanForm__item quarterWidth">
						<TextField
							field={formik.getFieldProps('operationRate')}
							theme="regular"
							label={t('reductionPlan.operationRate')}
							isValid={isValid('operationRate')}
							errorText={getErrorText('operationRate')}
							onBlur={handleRateBlur('operationRate')}
							InputLabelProps={{ shrink: true }}
							type="number"
							disabled={isLoading}
						/>
					</div>
					<div className="reductionPlanForm__item quarterWidth">
						<TextField
							field={formik.getFieldProps('otherRate')}
							theme="regular"
							label={t('reductionPlan.otherRate')}
							isValid={isValid('otherRate')}
							errorText={getErrorText('otherRate')}
							onBlur={handleRateBlur('otherRate')}
							InputLabelProps={{ shrink: true }}
							type="number"
							disabled={isLoading}
						/>
					</div>
				</div>

				<h3 className="sectionTitle">{t('reductionPlan.specificReductions')}</h3>
				<div className="specificReductionsContainer">
					<Tabs
						value={activeTab}
						onChange={(_, val) => setActiveTab(val)}
						indicatorColor="primary"
						textColor="primary"
					>
						<Tab label={`${t('reductionPlan.medicals')} (${medicalReductions.length})`} />
						<Tab label={`${t('reductionPlan.exams')} (${examReductions.length})`} />
						<Tab label={`${t('reductionPlan.operations')} (${operationReductions.length})`} />
						<Tab label={`${t('reductionPlan.others')} (${priceOtherReductions.length})`} />
					</Tabs>

					{activeTab === 0 && (
						<div>
							<div className="addRow">
								<div className="itemSelect">
									<Autocomplete
										id="selectMedical"
										size="small"
										options={availableMedicals}
										getOptionLabel={(option) =>
											`${option.description ?? ''} (${option.code ?? ''})`
										}
										isOptionEqualToValue={(option, value) =>
											option.code === value.code
										}
										value={
											availableMedicals.find(
												(m) => `${m.code}` === selectedMedicalCode,
											) ?? null
										}
										onChange={(_e, val) =>
											setSelectedMedicalCode(
												val?.code != null ? `${val.code}` : '',
											)
										}
										noOptionsText={t('common.nooptionsfound')}
										renderInput={(params) => (
											<MuiTextField
												{...params}
												label={t('reductionPlan.selectMedical')}
												variant="outlined"
												size="small"
											/>
										)}
									/>
								</div>
								<MuiTextField
									className="rateInput"
									size="small"
									type="number"
									label={t('reductionPlan.rate')}
									value={medicalRateInput}
									onChange={(e) => setMedicalRateInput(e.target.value)}
									inputProps={{ min: 0.01, max: 100, step: 0.01 }}
								/>
								<Button
									type="button"
									variant="contained"
									onClick={handleAddMedicalReduction}
									disabled={
										!selectedMedicalCode ||
										medicalRateInput === '' ||
										Number(medicalRateInput) < 0.01 ||
										Number(medicalRateInput) > 100
									}
								>
									{t('reductionPlan.addItem')}
								</Button>
								{medicalReductions.length > 0 && (
									<Button
										type="button"
										variant="text"
										onClick={() => setMedicalReductions([])}
									>
										{t('reductionPlan.removeAll')}
									</Button>
								)}
							</div>
							{medicalReductions.length === 0 ? (
								<div className="emptyMessage">
									{t('reductionPlan.noSpecificReductions')}
								</div>
							) : (
								<TableContainer component={Paper} className="tableContainer">
									<MuiTable size="small">
										<TableHead>
											<TableRow>
												<TableCell>{t('reductionPlan.item')}</TableCell>
												<TableCell>{t('reductionPlan.rate')}</TableCell>
												<TableCell align="right">{t('reductionPlan.actions')}</TableCell>
											</TableRow>
										</TableHead>
										<TableBody>
											{medicalReductions.map((item, index) => (
												<TableRow key={index}>
													<TableCell>
														{item.medical.description} ({item.medical.code})
													</TableCell>
													<TableCell>{item.reductionRate}%</TableCell>
													<TableCell align="right">
														<IconButton
															size="small"
															color="error"
															onClick={() =>
																setMedicalReductions((prev) =>
																	prev.filter((_, i) => i !== index),
																)
															}
														>
															<Delete fontSize="small" />
														</IconButton>
													</TableCell>
												</TableRow>
											))}
										</TableBody>
									</MuiTable>
								</TableContainer>
							)}
						</div>
					)}

					{activeTab === 1 && (
						<div>
							<div className="addRow">
								<div className="itemSelect">
									<Autocomplete
										id="selectExam"
										size="small"
										options={availableExams}
										getOptionLabel={(option) =>
											`${option.description ?? ''} (${option.code ?? ''})`
										}
										isOptionEqualToValue={(option, value) =>
											option.code === value.code
										}
										value={
											availableExams.find(
												(e) => e.code === selectedExamCode,
											) ?? null
										}
										onChange={(_e, val) =>
											setSelectedExamCode(
												val?.code != null ? `${val.code}` : '',
											)
										}
										noOptionsText={t('common.nooptionsfound')}
										renderInput={(params) => (
											<MuiTextField
												{...params}
												label={t('reductionPlan.selectExam')}
												variant="outlined"
												size="small"
											/>
										)}
									/>
								</div>
								<MuiTextField
									className="rateInput"
									size="small"
									type="number"
									label={t('reductionPlan.rate')}
									value={examRateInput}
									onChange={(e) => setExamRateInput(e.target.value)}
									inputProps={{ min: 0.01, max: 100, step: 0.01 }}
								/>
								<Button
									type="button"
									variant="contained"
									onClick={handleAddExamReduction}
									disabled={
										!selectedExamCode ||
										examRateInput === '' ||
										Number(examRateInput) < 0.01 ||
										Number(examRateInput) > 100
									}
								>
									{t('reductionPlan.addItem')}
								</Button>
								{examReductions.length > 0 && (
									<Button
										type="button"
										variant="text"
										onClick={() => setExamReductions([])}
									>
										{t('reductionPlan.removeAll')}
									</Button>
								)}
							</div>
							{examReductions.length === 0 ? (
								<div className="emptyMessage">
									{t('reductionPlan.noSpecificReductions')}
								</div>
							) : (
								<TableContainer component={Paper} className="tableContainer">
									<MuiTable size="small">
										<TableHead>
											<TableRow>
												<TableCell>{t('reductionPlan.item')}</TableCell>
												<TableCell>{t('reductionPlan.rate')}</TableCell>
												<TableCell align="right">{t('reductionPlan.actions')}</TableCell>
											</TableRow>
										</TableHead>
										<TableBody>
											{examReductions.map((item, index) => (
												<TableRow key={index}>
													<TableCell>
														{item.exam.description} ({item.exam.code})
													</TableCell>
													<TableCell>{item.reductionRate}%</TableCell>
													<TableCell align="right">
														<IconButton
															size="small"
															color="error"
															onClick={() =>
																setExamReductions((prev) =>
																	prev.filter((_, i) => i !== index),
																)
															}
														>
															<Delete fontSize="small" />
														</IconButton>
													</TableCell>
												</TableRow>
											))}
										</TableBody>
									</MuiTable>
								</TableContainer>
							)}
						</div>
					)}

					{activeTab === 2 && (
						<div>
							<div className="addRow">
								<div className="itemSelect">
									<Autocomplete
										id="selectOperation"
										size="small"
										options={availableOperations}
										getOptionLabel={(option) =>
											`${option.description ?? ''} (${option.code ?? ''})`
										}
										isOptionEqualToValue={(option, value) =>
											option.code === value.code
										}
										value={
											availableOperations.find(
												(op) => op.code === selectedOperationCode,
											) ?? null
										}
										onChange={(_e, val) =>
											setSelectedOperationCode(
												val?.code != null ? `${val.code}` : '',
											)
										}
										noOptionsText={t('common.nooptionsfound')}
										renderInput={(params) => (
											<MuiTextField
												{...params}
												label={t('reductionPlan.selectOperation')}
												variant="outlined"
												size="small"
											/>
										)}
									/>
								</div>
								<MuiTextField
									className="rateInput"
									size="small"
									type="number"
									label={t('reductionPlan.rate')}
									value={operationRateInput}
									onChange={(e) => setOperationRateInput(e.target.value)}
									inputProps={{ min: 0.01, max: 100, step: 0.01 }}
								/>
								<Button
									type="button"
									variant="contained"
									onClick={handleAddOperationReduction}
									disabled={
										!selectedOperationCode ||
										operationRateInput === '' ||
										Number(operationRateInput) < 0.01 ||
										Number(operationRateInput) > 100
									}
								>
									{t('reductionPlan.addItem')}
								</Button>
								{operationReductions.length > 0 && (
									<Button
										type="button"
										variant="text"
										onClick={() => setOperationReductions([])}
									>
										{t('reductionPlan.removeAll')}
									</Button>
								)}
							</div>
							{operationReductions.length === 0 ? (
								<div className="emptyMessage">
									{t('reductionPlan.noSpecificReductions')}
								</div>
							) : (
								<TableContainer component={Paper} className="tableContainer">
									<MuiTable size="small">
										<TableHead>
											<TableRow>
												<TableCell>{t('reductionPlan.item')}</TableCell>
												<TableCell>{t('reductionPlan.rate')}</TableCell>
												<TableCell align="right">{t('reductionPlan.actions')}</TableCell>
											</TableRow>
										</TableHead>
										<TableBody>
											{operationReductions.map((item, index) => (
												<TableRow key={index}>
													<TableCell>
														{item.operation.description} ({item.operation.code})
													</TableCell>
													<TableCell>{item.reductionRate}%</TableCell>
													<TableCell align="right">
														<IconButton
															size="small"
															color="error"
															onClick={() =>
																setOperationReductions((prev) =>
																	prev.filter((_, i) => i !== index),
																)
															}
														>
															<Delete fontSize="small" />
														</IconButton>
													</TableCell>
												</TableRow>
											))}
										</TableBody>
									</MuiTable>
								</TableContainer>
							)}
						</div>
					)}

					{activeTab === 3 && (
						<div>
							<div className="addRow">
								<div className="itemSelect">
									<Autocomplete
										id="selectOther"
										size="small"
										options={availableOthers}
										getOptionLabel={(option) =>
											`${option.description ?? ''} (${option.code ?? ''})`
										}
										isOptionEqualToValue={(option, value) =>
											option.id === value.id
										}
										value={
											availableOthers.find(
												(ot) => `${ot.id}` === selectedOtherId,
											) ?? null
										}
										onChange={(_e, val) =>
											setSelectedOtherId(
												val?.id != null ? `${val.id}` : '',
											)
										}
										noOptionsText={t('common.nooptionsfound')}
										renderInput={(params) => (
											<MuiTextField
												{...params}
												label={t('reductionPlan.selectOther')}
												variant="outlined"
												size="small"
											/>
										)}
									/>
								</div>
								<MuiTextField
									className="rateInput"
									size="small"
									type="number"
									label={t('reductionPlan.rate')}
									value={otherRateInput}
									onChange={(e) => setOtherRateInput(e.target.value)}
									inputProps={{ min: 0.01, max: 100, step: 0.01 }}
								/>
								<Button
									type="button"
									variant="contained"
									onClick={handleAddOtherReduction}
									disabled={
										!selectedOtherId ||
										otherRateInput === '' ||
										Number(otherRateInput) < 0.01 ||
										Number(otherRateInput) > 100
									}
								>
									{t('reductionPlan.addItem')}
								</Button>
								{priceOtherReductions.length > 0 && (
									<Button
										type="button"
										variant="text"
										onClick={() => setPriceOtherReductions([])}
									>
										{t('reductionPlan.removeAll')}
									</Button>
								)}
							</div>
							{priceOtherReductions.length === 0 ? (
								<div className="emptyMessage">
									{t('reductionPlan.noSpecificReductions')}
								</div>
							) : (
								<TableContainer component={Paper} className="tableContainer">
									<MuiTable size="small">
										<TableHead>
											<TableRow>
												<TableCell>{t('reductionPlan.item')}</TableCell>
												<TableCell>{t('reductionPlan.rate')}</TableCell>
												<TableCell align="right">{t('reductionPlan.actions')}</TableCell>
											</TableRow>
										</TableHead>
										<TableBody>
											{priceOtherReductions.map((item, index) => (
												<TableRow key={index}>
													<TableCell>
														{item.pricesOthers.description} ({item.pricesOthers.code})
													</TableCell>
													<TableCell>{item.reductionRate}%</TableCell>
													<TableCell align="right">
														<IconButton
															size="small"
															color="error"
															onClick={() =>
																setPriceOtherReductions((prev) =>
																	prev.filter((_, i) => i !== index),
																)
															}
														>
															<Delete fontSize="small" />
														</IconButton>
													</TableCell>
												</TableRow>
											))}
										</TableBody>
									</MuiTable>
								</TableContainer>
							)}
						</div>
					)}
				</div>

				<div className="reductionPlanForm__buttonSet">
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
					? reductionPlanStore.create.status === 'FAIL'
					: reductionPlanStore.update.status === 'FAIL') && (
					<div ref={infoBoxRef} className="info-box-container">
						<InfoBox type="error" message={errorMessage} />
					</div>
				)}

				<ConfirmationDialog
					isOpen={
						!!(creationMode
							? reductionPlanStore.create.hasSucceeded
							: reductionPlanStore.update.hasSucceeded)
					}
					title={
						creationMode
							? t('reductionPlan.created')
							: t('reductionPlan.updated')
					}
					icon={checkIcon}
					info={
						creationMode
							? t('reductionPlan.createSuccess')
							: t('reductionPlan.updateSuccess')
					}
					primaryButtonLabel="Ok"
					handlePrimaryButtonClick={() => {
						navigate(PATHS.admin_reductionplans, { replace: true });
					}}
					handleSecondaryButtonClick={() => ({})}
				/>
			</form>
		</div>
	);
};

export default ReductionPlanForm;
