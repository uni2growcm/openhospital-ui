import { useFormik } from 'formik';
import { get, has } from 'lodash';
import { type FC, useCallback, useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { object, string } from 'yup';
import DiscardButton from '~/components/accessories/discardButton/DiscardButton';
import ResetButton from '~/components/accessories/resetButton/resetButton';
import { resolveApiErrorMessage } from '~/libraries/apiUtils/resolveApiErrorMessage';
import { useAppDispatch, useAppSelector } from '~/libraries/hooks/redux';
import { FIELD_VALIDATION } from '~/types';
import checkIcon from '../../../../../assets/check-icon.png';
import { PATHS } from '../../../../../consts';
import {
	formatAllFieldValues,
	getFromFields,
} from '../../../../../libraries/formDataHandling/functions';
import {
	createPriceListReset,
	updatePriceListReset,
} from '../../../../../state/prices';
import Button from '../../../button/Button';
import ConfirmationDialog from '../../../confirmationDialog/ConfirmationDialog';
import InfoBox from '../../../infoBox/InfoBox';
import TextField from '../../../textField/TextField';
import './styles.scss';
import type { IPriceListFormProps } from './types';

const PriceListForm: FC<IPriceListFormProps> = ({
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

	const priceListStore = useAppSelector((state) => state.prices);

	const errorMessage = useMemo(
		() =>
			resolveApiErrorMessage(
				creationMode
					? priceListStore.createPriceList.error
					: priceListStore.updatePriceList.error,
				t,
			),
		[
			creationMode,
			t,
			priceListStore.createPriceList.error,
			priceListStore.updatePriceList.error,
		],
	);

	const initialValues = getFromFields(fields, 'value');

	const validationSchema = object({
		code: string()
			.max(7, t('validations.maxLength', { max: 7 }))
			.required(t('common.required')),
		name: string()
			.max(50, t('validations.maxLength', { max: 50 }))
			.required(t('common.required')),
		description: string()
			.max(100, t('validations.maxLength', { max: 100 }))
			.required(t('common.required')),
		currency: string()
			.max(10, t('validations.maxLength', { max: 10 }))
			.required(t('common.required')),
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
			dispatch(createPriceListReset());
		} else {
			dispatch(updatePriceListReset());
		}
	}, [creationMode, dispatch]);

	useEffect(() => {
		return cleanUp;
	}, [cleanUp]);

	return (
		<div className="priceListForm">
			<div className="priceListForm__header">
				<div className="priceListForm__actions">
					<DiscardButton />
				</div>
			</div>
			<form className="priceListForm__form" onSubmit={formik.handleSubmit}>
				<div className="row start-sm center-xs">
					<div className="priceListForm__item halfWidth">
						<TextField
							field={formik.getFieldProps('code')}
							theme="regular"
							label={t('pricelist.code')}
							isValid={isValid('code')}
							errorText={getErrorText('code')}
							onBlur={formik.handleBlur}
							type="text"
							disabled={isLoading || !creationMode}
							required={FIELD_VALIDATION.REQUIRED}
						/>
					</div>
					<div className="priceListForm__item halfWidth">
						<TextField
							field={formik.getFieldProps('name')}
							theme="regular"
							label={t('pricelist.name')}
							isValid={isValid('name')}
							errorText={getErrorText('name')}
							onBlur={formik.handleBlur}
							type="text"
							disabled={isLoading}
							required={FIELD_VALIDATION.REQUIRED}
						/>
					</div>
				</div>
				<div className="row start-sm center-xs">
					<div className="priceListForm__item halfWidth">
						<TextField
							field={formik.getFieldProps('description')}
							theme="regular"
							label={t('pricelist.description')}
							isValid={isValid('description')}
							errorText={getErrorText('description')}
							onBlur={formik.handleBlur}
							type="text"
							disabled={isLoading}
							required={FIELD_VALIDATION.REQUIRED}
						/>
					</div>
					<div className="priceListForm__item halfWidth">
						<TextField
							field={formik.getFieldProps('currency')}
							theme="regular"
							label={t('pricelist.currency')}
							isValid={isValid('currency')}
							errorText={getErrorText('currency')}
							onBlur={formik.handleBlur}
							type="text"
							disabled={isLoading}
							required={FIELD_VALIDATION.REQUIRED}
						/>
					</div>
				</div>

				<div className="priceListForm__buttonSet">
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
					? priceListStore.createPriceList.status === 'FAIL'
					: priceListStore.updatePriceList.status === 'FAIL') && (
					<div ref={infoBoxRef} className="info-box-container">
						<InfoBox type="error" message={errorMessage} />
					</div>
				)}
				<ConfirmationDialog
					isOpen={
						!!(creationMode
							? priceListStore.createPriceList.hasSucceeded
							: priceListStore.updatePriceList.hasSucceeded)
					}
					title={creationMode ? t('pricelist.created') : t('pricelist.updated')}
					icon={checkIcon}
					info={
						creationMode
							? t('pricelist.createSuccess')
							: t('pricelist.updateSuccess', { code: formik.values.code })
					}
					primaryButtonLabel="Ok"
					handlePrimaryButtonClick={() => {
						navigate(PATHS.admin_price_lists, { replace: true });
					}}
					handleSecondaryButtonClick={() => ({})}
				/>
			</form>
		</div>
	);
};

export default PriceListForm;
