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
		family: TypologyDTOFamilyEnum.AngalTypologyVisittype,
		getFamilyParam: GetTypologiesFamilyEnum.AngalTypologyVisittype,
		pathSegment: 'visittypes',
		translationKey: 'types.visitTypes',
	},
	partnertypes: {
		family: TypologyDTOFamilyEnum.AngalTypologyPartnertype,
		getFamilyParam: GetTypologiesFamilyEnum.AngalTypologyPartnertype,
		pathSegment: 'partnertypes',
		translationKey: 'types.partnerTypes',
	},
	familyplanningmethods: {
		family: TypologyDTOFamilyEnum.AngalTypologyFamilyplanningmethodtype,
		getFamilyParam: GetTypologiesFamilyEnum.AngalTypologyFamilyplanningmethodtype,
		pathSegment: 'familyplanningmethods',
		translationKey: 'types.familyPlanningMethods',
	},
	familyplanningvisittypes: {
		family: TypologyDTOFamilyEnum.AngalTypologyFamilyplanningvisittype,
		getFamilyParam: GetTypologiesFamilyEnum.AngalTypologyFamilyplanningvisittype,
		pathSegment: 'familyplanningvisittypes',
		translationKey: 'types.familyPlanningVisitTypes',
	},
	hivtreatmenttypes: {
		family: TypologyDTOFamilyEnum.AngalTypologyHivtreatmenttype,
		getFamilyParam: GetTypologiesFamilyEnum.AngalTypologyHivtreatmenttype,
		pathSegment: 'hivtreatmenttypes',
		translationKey: 'types.hivTreatmentTypes',
	},
	tuberculosisregimens: {
		family: TypologyDTOFamilyEnum.AngalTypologyTuberculosisregimen,
		getFamilyParam: GetTypologiesFamilyEnum.AngalTypologyTuberculosisregimen,
		pathSegment: 'tuberculosisregimens',
		translationKey: 'types.tuberculosisRegimens',
	},
	tuberculosiscontacts: {
		family: TypologyDTOFamilyEnum.AngalTypologyTuberculosiscontact,
		getFamilyParam: GetTypologiesFamilyEnum.AngalTypologyTuberculosiscontact,
		pathSegment: 'tuberculosiscontacts',
		translationKey: 'types.tuberculosisContacts',
	},
};
