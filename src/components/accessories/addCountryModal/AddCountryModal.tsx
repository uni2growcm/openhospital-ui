import {
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	FormHelperText,
} from '@mui/material';
import { useFormik } from 'formik';
import type { FunctionComponent } from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { object, string } from 'yup';
import { resolveApiErrorMessage } from '~/libraries/apiUtils/resolveApiErrorMessage';
import { useAppDispatch } from '~/libraries/hooks/redux';
import { createCountry, createCountryReset } from '~/state/types/countries';
import type { CountryDTO } from '../../../generated';
import Button from '../button/Button';
import TextField from '../textField/TextField';
import './styles.scss';
import type { IProps } from './types';

const AddCountryModal: FunctionComponent<IProps> = ({
	isOpen,
	onClose,
	onCreated,
}) => {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [apiError, setApiError] = useState('');

	const formik = useFormik({
		initialValues: { name: '', isoCode: '', phoneCode: '' },
		validationSchema: object({
			name: string().required(t('common.required')),
			isoCode: string().required(t('common.required')).max(2),
			phoneCode: string().required(t('common.required')),
		}),
		onSubmit: async (values) => {
			setApiError('');
			setIsSubmitting(true);
			const result = await dispatch(createCountry(values as CountryDTO));
			setIsSubmitting(false);
			if (createCountry.fulfilled.match(result)) {
				onCreated(result.payload as CountryDTO);
				formik.resetForm();
				dispatch(createCountryReset());
			} else {
				setApiError(resolveApiErrorMessage(result.payload, t));
			}
		},
	});

	const handleClose = () => {
		formik.resetForm();
		setApiError('');
		onClose();
	};

	const isValid = (field: 'name' | 'isoCode' | 'phoneCode') =>
		Boolean(formik.touched[field] && formik.errors[field]);

	const getErrorText = (field: 'name' | 'isoCode' | 'phoneCode') =>
		formik.touched[field] ? formik.errors[field] ?? '' : '';

	return (
		<Dialog open={isOpen} onClose={handleClose}>
			<DialogTitle>{t('patient.addcountry')}</DialogTitle>
			<form onSubmit={formik.handleSubmit}>
				<DialogContent className="addCountryModal__content">
					<TextField
						field={formik.getFieldProps('name')}
						theme="regular"
						label={t('patient.countryname')}
						isValid={isValid('name')}
						errorText={getErrorText('name')}
						onBlur={formik.handleBlur}
						disabled={isSubmitting}
						maxLength={100}
					/>
					<TextField
						field={formik.getFieldProps('isoCode')}
						theme="regular"
						label={t('patient.countryisocode')}
						isValid={isValid('isoCode')}
						errorText={getErrorText('isoCode')}
						onBlur={formik.handleBlur}
						disabled={isSubmitting}
						maxLength={2}
					/>
					<TextField
						field={formik.getFieldProps('phoneCode')}
						theme="regular"
						label={t('patient.countryphonecode')}
						isValid={isValid('phoneCode')}
						errorText={getErrorText('phoneCode')}
						onBlur={formik.handleBlur}
						disabled={isSubmitting}
						maxLength={10}
					/>
					{apiError ? <FormHelperText error>{apiError}</FormHelperText> : null}
				</DialogContent>
				<DialogActions>
					<Button type="reset" variant="text" onClick={handleClose}>
						{t('common.cancel')}
					</Button>
					<Button type="submit" variant="contained" disabled={isSubmitting}>
						{t('common.save')}
					</Button>
				</DialogActions>
			</form>
		</Dialog>
	);
};

export default AddCountryModal;
