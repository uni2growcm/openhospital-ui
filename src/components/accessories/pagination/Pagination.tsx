import { type FunctionComponent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../button/Button';
import './styles.scss';
import type { IProps } from './types';

const Pagination: FunctionComponent<IProps> = ({
	page,
	totalPages,
	totalElements,
	setPage,
	disabled = false,
	pageSize,
	setPageSize,
	className = '',
}) => {
	const { t } = useTranslation();
	const [sizeInput, setSizeInput] = useState<string>(
		pageSize !== undefined ? String(pageSize) : '',
	);

	useEffect(() => {
		if (pageSize !== undefined) {
			setSizeInput(String(pageSize));
		}
	}, [pageSize]);

	const commitSize = () => {
		if (!setPageSize || pageSize === undefined) {
			return;
		}
		const parsed = Number.parseInt(sizeInput, 10);
		if (!Number.isNaN(parsed) && parsed > 0 && parsed <= 500) {
			setPageSize(parsed);
			setPage(0);
		} else {
			setSizeInput(String(pageSize));
		}
	};

	if (
		totalPages <= 0 &&
		(totalElements === undefined || totalElements === 0)
	) {
		return null;
	}

	const pages: number[] = [];
	const start = Math.max(0, page - 2);
	const end = Math.min(Math.max(0, totalPages - 1), page + 2);
	for (let i = start; i <= end; i++) {
		pages.push(i);
	}

	return (
		<div className={`pagination ${className}`}>
			<span className="pagination_info">
				{t('common.page')} {totalPages > 0 ? page + 1 : 0} / {totalPages}
				{totalElements !== undefined && (
					<>
						{' '}
						— {totalElements} {t('common.total_items')}
					</>
				)}
			</span>

			<div className="pagination_controls">
				{pageSize !== undefined && setPageSize && (
					<div className="pagination_pageSize">
						<span>{t('common.per_page')} :</span>
						<input
							type="number"
							min="1"
							max="500"
							value={sizeInput}
							onChange={(e) => setSizeInput(e.target.value)}
							onBlur={commitSize}
							onKeyDown={(e) => {
								if (e.key === 'Enter') {
									commitSize();
								}
							}}
							disabled={disabled}
						/>
					</div>
				)}

				<Button
					type="button"
					variant="outlined"
					disabled={page === 0 || disabled}
					onClick={() => setPage(0)}
				>
					{'<<'}
				</Button>

				<Button
					type="button"
					variant="outlined"
					disabled={page === 0 || disabled}
					onClick={() => setPage((p) => Math.max(0, p - 1))}
				>
					{t('common.previous')}
				</Button>

				{pages.map((p) => (
					<Button
						key={p}
						type="button"
						variant={p === page ? 'contained' : 'outlined'}
						disabled={disabled}
						className={p === page ? 'pagination_currentPage' : ''}
						onClick={() => setPage(p)}
					>
						{p + 1}
					</Button>
				))}

				<Button
					type="button"
					variant="outlined"
					disabled={page + 1 >= totalPages || disabled}
					onClick={() => setPage((p) => p + 1)}
				>
					{t('common.next')}
				</Button>

				<Button
					type="button"
					variant="outlined"
					disabled={page + 1 >= totalPages || disabled}
					onClick={() => setPage(totalPages - 1)}
				>
					{'>>'}
				</Button>
			</div>
		</div>
	);
};

export default Pagination;
