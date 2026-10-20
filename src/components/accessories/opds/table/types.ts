import type { OpdDTO } from '../../../../generated';
import type { IProps as IPaginationProps } from '../../pagination/types';

export interface IOpdTableProps {
	data: OpdDTO[];
	serverPagination?: IPaginationProps;
}
