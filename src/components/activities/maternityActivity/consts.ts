import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import PregnantWomanIcon from '@mui/icons-material/PregnantWoman';
import type { IMaternityAction } from './types';

export const MATERNITY_ACTIONS: IMaternityAction[] = [
	{
		id: 'pregnancy-care',
		translationKey: 'maternity.pregnancy_care',
		Icon: PregnantWomanIcon,
	},
	{
		id: 'hiv-followup',
		translationKey: 'maternity.hiv_followup',
		Icon: HealthAndSafetyIcon,
	},
	{
		id: 'family-planning',
		translationKey: 'maternity.family_planning',
		Icon: FamilyRestroomIcon,
	},
];
