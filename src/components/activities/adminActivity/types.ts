export type TActivityTransitionState = 'IDLE' | 'TO_PATIENT_EDITING';

export type IAdminSection =
	| 'wards'
	| 'diseases'
	| 'exams'
	| 'operations'
	| 'vaccines'
	| 'prices'
	| 'suppliers'
	| 'articleFamilies'
	| 'telemetry'
	| 'users'
	| 'settings'
	| 'types'
	| 'hospitalInfo';
