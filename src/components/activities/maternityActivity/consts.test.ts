import { describe, expect, it } from 'vitest';
import { MATERNITY_ACTIONS } from './consts';

describe('Maternity Activity configuration and actions', () => {
	it('should define exactly 3 cards for maternity module', () => {
		expect(MATERNITY_ACTIONS).toHaveLength(3);
	});

	it('should contain pregnancy care, HIV follow up, and family planning actions', () => {
		const actionIds = MATERNITY_ACTIONS.map((action) => action.id);
		expect(actionIds).toEqual([
			'pregnancy-care',
			'hiv-followup',
			'family-planning',
		]);
	});

	it('should have valid translation keys for each action', () => {
		const translationKeys = MATERNITY_ACTIONS.map(
			(action) => action.translationKey,
		);
		expect(translationKeys).toEqual([
			'maternity.pregnancy_care',
			'maternity.hiv_followup',
			'maternity.family_planning',
		]);
	});

	it('should have an icon component defined for each action', () => {
		MATERNITY_ACTIONS.forEach((action) => {
			expect(action.Icon).toBeDefined();
		});
	});
});
