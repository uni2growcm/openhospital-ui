import moment from 'moment';
import type { BillPaymentsDTO } from '../../generated/models';

export const billPaymentsDTO: BillPaymentsDTO = {
	id: 0,
	billId: 10,
	date: new Date().toISOString(),
	amount: 500,
	user: 'admin',
	patName: 'Antonio Carlos',
	patientCode: 1,
};

export const billPaymentsDTOs: BillPaymentsDTO[] = [
	{
		id: 10,
		billId: 10,
		date: new Date().toISOString(),
		amount: 50,
		user: 'admin',
		patName: 'Antonio Carlos',
		patientCode: 1,
	},
	{
		id: 4,
		billId: 10,
		date: new Date().toISOString(),
		amount: 100,
		user: 'admin',
		patName: 'Antonio Carlos',
		patientCode: 1,
	},
	{
		id: 20,
		billId: 3,
		date: moment().add(-1, 'days').toISOString(),
		amount: 300,
		user: 'cashier2',
		patName: 'Cedimo Andrea',
		patientCode: 2,
	},
	{
		id: 21,
		billId: 36,
		date: moment().add(-2, 'days').toISOString(),
		amount: 5000,
		user: 'admin',
		patName: 'Cedimo Andrea',
		patientCode: 2,
	},
	{
		id: 22,
		billId: 12,
		date: moment().add(-6, 'days').toISOString(),
		amount: 1500,
		user: 'cashier2',
		patName: 'Antonio Carlos',
		patientCode: 1,
	},
	{
		id: 23,
		billId: 14,
		date: new Date().toISOString(),
		amount: 850,
		user: 'admin',
		patName: 'Antonio Carlos',
		patientCode: 1,
	},
];

export default billPaymentsDTO;
