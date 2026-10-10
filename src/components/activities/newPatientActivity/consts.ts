import {
	PatientDTOFatherEnum,
	PatientDTOMotherEnum,
	PatientDTOSexEnum,
} from '../../../generated';
import type { TFields } from '../../../libraries/formDataHandling/types';
import type { TPatientDataFormFieldName } from '../../accessories/patientDataForm/types';

const sexOptions = [
	{
		label: 'common.male',
		value: PatientDTOSexEnum.M,
	},
	{
		label: 'common.female',
		value: PatientDTOSexEnum.F,
	},
];

const bloodTypeOptions = [
	{
		label: '0-',
		value: '0-',
	},
	{
		label: '0+',
		value: '0+',
	},
	{
		label: 'A-',
		value: 'A-',
	},
	{
		label: 'A+',
		value: 'A+',
	},
	{
		label: 'B-',
		value: 'B-',
	},
	{
		label: 'B+',
		value: 'B+',
	},
	{
		label: 'AB-',
		value: 'AB-',
	},
	{
		label: 'AB+',
		value: 'AB+',
	},
];

const yesOrNoOrUnknownOptions = [
	{
		label: 'common.yes',
		value: 'Y',
	},
	{
		label: 'common.no',
		value: 'N',
	},
	{
		label: 'common.unknown',
		value: 'U',
	},
];

const aliveOrDeadOrUnknownOptions = [
	{
		label: 'common.alive',
		value: 'A',
	},
	{
		label: 'common.dead',
		value: 'D',
	},
	{
		label: 'common.unknown',
		value: 'U',
	},
];

const geographicPositionOptions = [
	{
		label: 'patient.geographicpositions.in',
		value: 'IN',
	},
	{
		label: 'patient.geographicpositions.out',
		value: 'OUT',
	},
	{
		label: 'patient.geographicpositions.outd',
		value: 'OUTD',
	},
];

const maritalStatusOptions = [
	{
		label: 'patient.maritalstatuses.unknown',
		value: 'unknown',
	},
	{
		label: 'patient.maritalstatuses.single',
		value: 'single',
	},
	{
		label: 'patient.maritalstatuses.married',
		value: 'married',
	},
	{
		label: 'patient.maritalstatuses.divorced',
		value: 'divorced',
	},
	{
		label: 'patient.maritalstatuses.widowed',
		value: 'widowed',
	},
];

const professionOptions = [
	{
		label: 'patient.professions.unknown',
		value: 'unknown',
	},
	{
		label: 'patient.professions.other',
		value: 'other',
	},
	{
		label: 'patient.professions.farming',
		value: 'farming',
	},
	{
		label: 'patient.professions.construction',
		value: 'construction',
	},
	{
		label: 'patient.professions.medicine',
		value: 'medicine',
	},
	{
		label: 'patient.professions.foodhospitality',
		value: 'foodhospitality',
	},
	{
		label: 'patient.professions.homemaker',
		value: 'homemaker',
	},
	{
		label: 'patient.professions.mechanic',
		value: 'mechanic',
	},
	{
		label: 'patient.professions.business',
		value: 'business',
	},
	{
		label: 'patient.professions.janitorial',
		value: 'janitorial',
	},
	{
		label: 'patient.professions.mining',
		value: 'mining',
	},
	{
		label: 'patient.professions.engineering',
		value: 'engineering',
	},
];

export const initialFields: TFields<TPatientDataFormFieldName> = {
	firstName: {
		value: '',
		type: 'text',
	},
	secondName: {
		value: '',
		type: 'text',
	},
	birthDate: {
		value: '',
		type: 'date',
	},
	birthPlace: {
		value: '',
		type: 'text',
	},
	age: {
		value: '28',
		type: 'number',
	},
	agetype: {
		value: '',
		type: 'text',
	},
	sex: {
		value: '',
		type: 'text',
		options: sexOptions,
	},
	address: {
		value: '',
		type: 'text',
	},
	city: {
		value: '',
		type: 'text',
	},
	telephone: {
		value: '',
		type: 'text',
	},
	note: {
		value: '',
		type: 'text',
	},
	motherName: {
		value: '',
		type: 'text',
	},
	mother: {
		value: PatientDTOMotherEnum.A,
		type: 'text',
		options: aliveOrDeadOrUnknownOptions,
	},
	numberOfChildren: {
		value: '',
		type: 'number',
	},
	geographicPosition: {
		value: '',
		type: 'text',
		options: geographicPositionOptions,
	},
	parentsResidence: {
		value: '',
		type: 'text',
	},
	transportMeans: {
		value: '',
		type: 'text',
	},
	blama: {
		value: '',
		type: 'text',
	},
	country: {
		value: '',
		type: 'text',
	},
	affiliatedPatientCode: {
		value: '',
		type: 'text',
	},
	fatherName: {
		value: '',
		type: 'text',
	},
	father: {
		value: PatientDTOFatherEnum.A,
		type: 'text',
		options: aliveOrDeadOrUnknownOptions,
	},
	bloodType: {
		value: '',
		type: 'text',
		options: bloodTypeOptions,
	},
	hasInsurance: {
		value: 'N',
		type: 'text',
		options: yesOrNoOrUnknownOptions,
	},
	parentTogether: {
		value: 'U',
		type: 'text',
		options: yesOrNoOrUnknownOptions,
	},
	taxCode: {
		value: '',
		type: 'text',
	},
	maritalStatus: {
		value: '',
		type: 'text',
		options: maritalStatusOptions,
	},
	profession: {
		value: '',
		type: 'text',
		options: professionOptions,
	},
	priceList: {
		value: '',
		type: 'text',
	},
	reductionPlan: {
		value: '',
		type: 'text',
	},
	consensusFlag: {
		value: 'false',
		type: 'boolean',
	},
	consensusServiceFlag: {
		value: 'false',
		type: 'boolean',
	},
	blobPhoto: {
		value: '',
		type: 'text',
	},
};
