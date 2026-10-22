import type { ReductionPlanDTO } from '../../generated/models';
import { medicalDTO } from './medicalDTO';

export const reductionPlanDTOs: ReductionPlanDTO[] = [
	{
		id: 1,
		description: 'Standard Discount',
		medicalRate: 10,
		examRate: 5,
		operationRate: 15,
		otherRate: 0,
		lock: 1,
		medicalReductions: [],
		examReductions: [],
		operationReductions: [],
		priceOtherReductions: [],
	},
	{
		id: 2,
		description: 'VIP Plan',
		medicalRate: 20,
		examRate: 20,
		operationRate: 20,
		otherRate: 20,
		lock: 1,
		medicalReductions: [{ id: 1, medical: medicalDTO, reductionRate: 30 }],
		examReductions: [],
		operationReductions: [],
		priceOtherReductions: [],
	},
];

export default reductionPlanDTOs;
