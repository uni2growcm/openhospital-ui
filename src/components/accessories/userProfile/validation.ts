import { object, ref, string } from 'yup';

// min 5 characters, 1 upper case letter, 1 lower case letter, 1 numeric digit.
export const passwordRules = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{5,}$/;

export const changePasswordSchema = (t: (key: string) => string) =>
	object().shape({
		oldPasswd: string().required(t('profile.oldPasswordRequired')),
		newPasswd: string()
			.required(t('profile.newPasswordRequired'))
			.min(5, t('profile.passwordTooShort'))
			.matches(passwordRules, {
				message: t('profile.passwordTooWeak'),
			}),
		confirmPasswd: string()
			.oneOf([ref('newPasswd')], t('profile.passwordMustMatch'))
			.required(t('profile.confirmPasswordRequired')),
	});
