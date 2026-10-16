export type TActivityTransitionState = 'IDLE' | 'TO_PATIENT_EDITING';

export type IAdminSection =
	| 'wards'
	| 'staff'
	| 'diseases'
	| 'exams'
	| 'operations'
	| 'vaccines'
	| 'prices'
	| 'suppliers'
	| 'telemetry'
	| 'users'
	| 'settings'
	| 'types'
	| 'hospitalInfo'
	| 'reductionPlans';
