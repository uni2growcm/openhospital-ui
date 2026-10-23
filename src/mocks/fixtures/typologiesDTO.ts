import { type TypologyDTO, TypologyDTOFamilyEnum } from '../../generated';

export const typologiesDTO: TypologyDTO[] = [
	{
		code: 'DT_NORMAL',
		description: 'NORMAL DELIVERY',
		family: TypologyDTOFamilyEnum.Deliverytype,
	},
	{
		code: 'DT_CESARIAN',
		description: 'DELIVERY ASSISTED BY CESARIAN SECTION',
		family: TypologyDTOFamilyEnum.Deliverytype,
	},
	{
		code: 'DT_VACUUM',
		description: 'DELIVERY ASSISTED BY VACUUM EXTRACTION',
		family: TypologyDTOFamilyEnum.Deliverytype,
	},
	{
		code: 'VT_FIRST',
		description: 'First visit',
		family: TypologyDTOFamilyEnum.Visittype,
	},
	{
		code: 'VT_FOLLOWUP',
		description: 'Follow-up visit',
		family: TypologyDTOFamilyEnum.Visittype,
	},
	{
		code: 'VT_EMERGENCY',
		description: 'Emergency visit',
		family: TypologyDTOFamilyEnum.Visittype,
	},
	{
		code: 'PT_SPOUSE',
		description: 'Spouse',
		family: TypologyDTOFamilyEnum.Partnertype,
	},
	{
		code: 'PT_REGULAR',
		description: 'Regular partner',
		family: TypologyDTOFamilyEnum.Partnertype,
	},
	{
		code: 'PT_OCCASIONAL',
		description: 'Occasional partner',
		family: TypologyDTOFamilyEnum.Partnertype,
	},
	{
		code: 'FPM_PILL',
		description: 'Oral contraceptive pill',
		family: TypologyDTOFamilyEnum.Familyplanningmethodtype,
	},
	{
		code: 'FPM_INJECTABLE',
		description: 'Injectable contraceptive',
		family: TypologyDTOFamilyEnum.Familyplanningmethodtype,
	},
	{
		code: 'FPM_IUD',
		description: 'Intrauterine device (IUD)',
		family: TypologyDTOFamilyEnum.Familyplanningmethodtype,
	},
	{
		code: 'FPV_NEW',
		description: 'New acceptor',
		family: TypologyDTOFamilyEnum.Familyplanningvisittype,
	},
	{
		code: 'FPV_CONTINUING',
		description: 'Continuing user',
		family: TypologyDTOFamilyEnum.Familyplanningvisittype,
	},
	{
		code: 'FPV_SWITCH',
		description: 'Method switch',
		family: TypologyDTOFamilyEnum.Familyplanningvisittype,
	},
	{
		code: 'HIV_FIRSTLINE',
		description: 'First-line antiretroviral therapy',
		family: TypologyDTOFamilyEnum.Hivtreatmenttype,
	},
	{
		code: 'HIV_SECONDLINE',
		description: 'Second-line antiretroviral therapy',
		family: TypologyDTOFamilyEnum.Hivtreatmenttype,
	},
	{
		code: 'HIV_PEP',
		description: 'Post-exposure prophylaxis (PEP)',
		family: TypologyDTOFamilyEnum.Hivtreatmenttype,
	},
	{
		code: 'TBR_2RHZE4RH',
		description: '2RHZE/4RH - New patient regimen',
		family: TypologyDTOFamilyEnum.Tuberculosisregimen,
	},
	{
		code: 'TBR_RETREATMENT',
		description: 'Retreatment regimen',
		family: TypologyDTOFamilyEnum.Tuberculosisregimen,
	},
	{
		code: 'TBR_MDR',
		description: 'MDR-TB short regimen',
		family: TypologyDTOFamilyEnum.Tuberculosisregimen,
	},
	{
		code: 'TBC_HOUSEHOLD',
		description: 'Household contact',
		family: TypologyDTOFamilyEnum.Tuberculosiscontact,
	},
	{
		code: 'TBC_CLOSE',
		description: 'Close contact',
		family: TypologyDTOFamilyEnum.Tuberculosiscontact,
	},
	{
		code: 'TBC_WORKPLACE',
		description: 'Workplace contact',
		family: TypologyDTOFamilyEnum.Tuberculosiscontact,
	},
];
