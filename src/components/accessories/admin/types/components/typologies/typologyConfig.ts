import {
	TypologyDTOFamilyEnum,
} from '../../../../../../generated';

export interface TypologyFamilyConfig {
	family: TypologyDTOFamilyEnum;
	getFamilyParam: TypologyDTOFamilyEnum;
	pathSegment: string;
	translationKey: string;
}

export const TYPOLOGY_FAMILIES: Record<string, TypologyFamilyConfig> = {
	visittypes: {
		family: TypologyDTOFamilyEnum.Visittype,
		getFamilyParam: TypologyDTOFamilyEnum.Visittype,
		pathSegment: 'visittypes',
		translationKey: 'types.visitTypes',
	},
	partnertypes: {
		family: TypologyDTOFamilyEnum.Partnertype,
		getFamilyParam: TypologyDTOFamilyEnum.Partnertype,
		pathSegment: 'partnertypes',
		translationKey: 'types.partnerTypes',
	},
	familyplanningmethods: {
		family: TypologyDTOFamilyEnum.Familyplanningmethodtype,
		getFamilyParam: TypologyDTOFamilyEnum.Familyplanningmethodtype,
		pathSegment: 'familyplanningmethods',
		translationKey: 'types.familyPlanningMethods',
	},
	familyplanningvisittypes: {
		family: TypologyDTOFamilyEnum.Familyplanningvisittype,
		getFamilyParam: TypologyDTOFamilyEnum.Familyplanningvisittype,
		pathSegment: 'familyplanningvisittypes',
		translationKey: 'types.familyPlanningVisitTypes',
	},
	hivtreatmenttypes: {
		family: TypologyDTOFamilyEnum.Hivtreatmenttype,
		getFamilyParam: TypologyDTOFamilyEnum.Hivtreatmenttype,
		pathSegment: 'hivtreatmenttypes',
		translationKey: 'types.hivTreatmentTypes',
	},
	tuberculosisregimens: {
		family: TypologyDTOFamilyEnum.Tuberculosisregimen,
		getFamilyParam: TypologyDTOFamilyEnum.Tuberculosisregimen,
		pathSegment: 'tuberculosisregimens',
		translationKey: 'types.tuberculosisRegimens',
	},
	tuberculosiscontacts: {
		family: TypologyDTOFamilyEnum.Tuberculosiscontact,
		getFamilyParam: TypologyDTOFamilyEnum.Tuberculosiscontact,
		pathSegment: 'tuberculosiscontacts',
		translationKey: 'types.tuberculosisContacts',
	},
};
