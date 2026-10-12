export interface IProps {
	page: number;
	totalPages: number;
	totalElements?: number;
	setPage: (page: number | ((prev: number) => number)) => void;
	disabled?: boolean;
	pageSize?: number;
	setPageSize?: (size: number) => void;
	className?: string;
}
