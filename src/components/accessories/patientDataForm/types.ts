import type { PatientDTO } from '../../../generated';
import type { IForm } from '../../../libraries/formDataHandling/types';

interface IOwnProps {
	profilePicture?: any;
	shouldResetForm: boolean;
	resetFormCallback: () => void;
	mode: 'create' | 'edit';
}

export type TAgeFieldName = 'age' | 'agetype' | 'birthDate';

export type TProps = IForm<TPatientDataFormFieldName, PatientDTO> & IOwnProps;

export type TAgeType = {
	age?: number;
	agetype?: string;
	birthDate?: string;
};

export type TPatientDataFormFieldName =
	| 'firstName'
	| 'secondName'
	| 'birthDate'
	| 'birthPlace'
	| 'age'
	| 'agetype'
	| 'sex'
	| 'address'
	| 'city'
	| 'telephone'
	| 'note'
	| 'motherName'
	| 'mother'
	| 'numberOfChildren'
	| 'geographicPosition'
	| 'parentsResidence'
	| 'transportMeans'
	| 'blama'
	| 'country'
	| 'affiliatedPatientCode'
	| 'fatherName'
	| 'father'
	| 'bloodType'
	| 'hasInsurance'
	| 'parentTogether'
	| 'taxCode'
	| 'maritalStatus'
	| 'profession'
	| 'priceList'
	| 'reductionPlan'
	| 'consensusFlag'
	| 'consensusServiceFlag'
	| 'blobPhoto';
