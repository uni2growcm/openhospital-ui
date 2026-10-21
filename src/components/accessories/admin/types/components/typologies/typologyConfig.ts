import {
	GetTypologiesFamilyEnum,
	TypologyDTOFamilyEnum,
} from '../../../../../../generated';

export interface TypologyFamilyConfig {
	family: TypologyDTOFamilyEnum;
	getFamilyParam: GetTypologiesFamilyEnum;
	pathSegment: string;
	translationKey: string;
}

export const TYPOLOGY_FAMILIES: Record<string, TypologyFamilyConfig> = {
	visittypes: {
		family: TypologyDTOFamilyEnum.Visittype,
		getFamilyParam: GetTypologiesFamilyEnum.Visittype,
		pathSegment: 'visittypes',
		translationKey: 'types.visitTypes',
	},
	partnertypes: {
		family: TypologyDTOFamilyEnum.Partnertype,
		getFamilyParam: GetTypologiesFamilyEnum.Partnertype,
		pathSegment: 'partnertypes',
		translationKey: 'types.partnerTypes',
	},
	familyplanningmethods: {
		family: TypologyDTOFamilyEnum.Familyplanningmethodtype,
		getFamilyParam: GetTypologiesFamilyEnum.Familyplanningmethodtype,
		pathSegment: 'familyplanningmethods',
		translationKey: 'types.familyPlanningMethods',
	},
	familyplanningvisittypes: {
		family: TypologyDTOFamilyEnum.Familyplanningvisittype,
		getFamilyParam: GetTypologiesFamilyEnum.Familyplanningvisittype,
		pathSegment: 'familyplanningvisittypes',
		translationKey: 'types.familyPlanningVisitTypes',
	},
	hivtreatmenttypes: {
		family: TypologyDTOFamilyEnum.Hivtreatmenttype,
		getFamilyParam: GetTypologiesFamilyEnum.Hivtreatmenttype,
		pathSegment: 'hivtreatmenttypes',
		translationKey: 'types.hivTreatmentTypes',
	},
	tuberculosisregimens: {
		family: TypologyDTOFamilyEnum.Tuberculosisregimen,
		getFamilyParam: GetTypologiesFamilyEnum.Tuberculosisregimen,
		pathSegment: 'tuberculosisregimens',
		translationKey: 'types.tuberculosisRegimens',
	},
	tuberculosiscontacts: {
		family: TypologyDTOFamilyEnum.Tuberculosiscontact,
		getFamilyParam: GetTypologiesFamilyEnum.Tuberculosiscontact,
		pathSegment: 'tuberculosiscontacts',
		translationKey: 'types.tuberculosisContacts',
	},
};
