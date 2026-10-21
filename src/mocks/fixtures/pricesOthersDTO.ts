import type { PricesOthersDTO } from '../../generated/models';

export const pricesOthersDTO: PricesOthersDTO[] = [
	{
		id: 1,
		code: 'OTH001',
		description: 'Bed day',
		opdInclude: false,
		ipdInclude: true,
		daily: true,
		discharge: false,
		hashCode: 0,
	},
	{
		id: 2,
		code: 'OTH002',
		description: 'Discharge fee',
		opdInclude: false,
		ipdInclude: true,
		daily: false,
		discharge: true,
		hashCode: 0,
	},
];
