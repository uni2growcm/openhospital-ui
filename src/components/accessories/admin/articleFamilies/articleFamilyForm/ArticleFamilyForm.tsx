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
	createArticleFamilyReset,
	updateArticleFamilyReset,
} from '../../../../../state/articleFamilies';
import Button from '../../../button/Button';
import ConfirmationDialog from '../../../confirmationDialog/ConfirmationDialog';
import InfoBox from '../../../infoBox/InfoBox';
import TextField from '../../../textField/TextField';
import './styles.scss';
import type { IArticleFamilyFormProps } from './types';

const ArticleFamilyForm: FC<IArticleFamilyFormProps> = ({
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

	const articleFamilyStore = useAppSelector((state) => state.articleFamilies);

	const errorMessage = useMemo(() => {
		const rawKey = creationMode
			? articleFamilyStore.create.error?.message
			: articleFamilyStore.update.error?.message;
		return rawKey ? t(rawKey) : t('common.somethingwrong');
	}, [
		creationMode,
		t,
		articleFamilyStore.create.error?.message,
		articleFamilyStore.update.error?.message,
	]);

	const initialValues = getFromFields(fields, 'value');

	const validationSchema = object({
		id: string().notRequired(),
		lock: string().notRequired(),
		code: string()
			.required(t('common.required'))
			.max(50, t('validations.maxLength', { max: 50 })),
		description: string()
			.required(t('common.required'))
			.max(255, t('validations.maxLength', { max: 255 })),
	});

	const formik = useFormik({
		initialValues,
		validationSchema,
		enableReinitialize: true,
		onSubmit: (values) => {
			const formattedValues = formatAllFieldValues(fields, values);
			if (formattedValues.code) {
				formattedValues.code = (formattedValues.code as string)
					.trim()
					.toUpperCase();
			}
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
			dispatch(createArticleFamilyReset());
		} else {
			dispatch(updateArticleFamilyReset());
		}
	}, [creationMode, dispatch]);

	useEffect(() => {
		return cleanUp;
	}, [cleanUp]);

	return (
		<div className="articleFamilyForm">
			<div className="articleFamilyForm__header">
				<div className="articleFamilyForm__actions">
					<DiscardButton />
				</div>
			</div>
			<form className="articleFamilyForm__form" onSubmit={formik.handleSubmit}>
				<div className="row start-sm center-xs">
					<div className="articleFamilyForm__item halfWidth">
						<TextField
							field={{
								...formik.getFieldProps('code'),
								onChange: (e: any) => {
									const value = e.target.value.toUpperCase();
									formik.setFieldValue('code', value);
								},
							}}
							theme="regular"
							label={t('articleFamily.code')}
							isValid={isValid('code')}
							errorText={getErrorText('code')}
							onBlur={formik.handleBlur}
							type="text"
							disabled={isLoading}
						/>
					</div>
					<div className="articleFamilyForm__item halfWidth">
						<TextField
							field={formik.getFieldProps('description')}
							theme="regular"
							label={t('articleFamily.description')}
							isValid={isValid('description')}
							errorText={getErrorText('description')}
							onBlur={formik.handleBlur}
							type="text"
							disabled={isLoading}
						/>
					</div>
				</div>

				<div className="articleFamilyForm__buttonSet">
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
					? articleFamilyStore.create.status === 'FAIL'
					: articleFamilyStore.update.status === 'FAIL') && (
					<div ref={infoBoxRef} className="info-box-container">
						<InfoBox type="error" message={errorMessage} />
					</div>
				)}
				<ConfirmationDialog
					isOpen={
						!!(creationMode
							? articleFamilyStore.create.hasSucceeded
							: articleFamilyStore.update.hasSucceeded)
					}
					title={
						creationMode
							? t('articleFamily.created')
							: t('articleFamily.updated')
					}
					icon={checkIcon}
					info={
						creationMode
							? t('articleFamily.createSuccess')
							: t('articleFamily.updateSuccess')
					}
					primaryButtonLabel="Ok"
					handlePrimaryButtonClick={() => {
						navigate(PATHS.admin_article_families, { replace: true });
					}}
					handleSecondaryButtonClick={() => ({})}
				/>
			</form>
		</div>
	);
};

export default ArticleFamilyForm;
