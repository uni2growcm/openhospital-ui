import type { LaboratoryDTO, LabWithRowsDTO } from '../../../../generated';
import type { IProps as IPaginationProps } from '../../pagination/types';

export interface IExamTableProps {
	data: LabWithRowsDTO[];
	handleEdit?: (row: LaboratoryDTO) => void;
	handleDelete?: (code: number | undefined) => void;
	handleCancel?: (code: number | undefined) => void;
	serverPagination?: IPaginationProps;
}

export const multipleResultsLabel = 'angal.lab.multipleresults.txt';
