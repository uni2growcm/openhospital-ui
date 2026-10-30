import { describe, expect, it } from 'vitest';
import { changePasswordSchema } from './validation';

const schema = changePasswordSchema((key) => key);

const validValues = {
	oldPasswd: 'OldPass1',
	newPasswd: 'NewPass1',
	confirmPasswd: 'NewPass1',
};

describe('change password schema', () => {
	it('should accept a valid password change', async () => {
		await expect(schema.validate(validValues)).resolves.toBeTruthy();
	});

	it('should require the current password', async () => {
		await expect(
			schema.validate({ ...validValues, oldPasswd: '' }),
		).rejects.toThrow();
	});

	it('should reject a weak new password', async () => {
		await expect(
			schema.validate({
				...validValues,
				newPasswd: 'weak',
				confirmPasswd: 'weak',
			}),
		).rejects.toThrow();
	});

	it('should reject mismatched confirmation', async () => {
		await expect(
			schema.validate({ ...validValues, confirmPasswd: 'NewPass2' }),
		).rejects.toThrow();
	});
});
