import { CircularProgress } from '@mui/material';
import { type ReactNode, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import ConfirmationDialog from '~/components/accessories/confirmationDialog/ConfirmationDialog';
import { useAppDispatch, useAppSelector } from '~/libraries/hooks/redux';
import checkIcon from '../../../../../assets/check-icon.png';
import type { ArticleFamilyDTO } from '../../../../../generated';
import {
	deleteArticleFamilyReset,
	getArticleFamilies,
} from '../../../../../state/articleFamilies';
import InfoBox from '../../../infoBox/InfoBox';
import type { TFilterField } from '../../../table/filter/types';
import Table from '../../../table/Table';
import classes from './ArticleFamiliesTable.module.scss';

interface IOwnProps {
	onEdit: (row: any) => void;
	onDelete: (row: any) => void;
	headerActions?: ReactNode;
}

export const ArticleFamiliesTable = ({
	onEdit,
	onDelete,
	headerActions,
}: IOwnProps) => {
	const dispatch = useAppDispatch();
	const { t } = useTranslation();
	const infoBoxRef = useRef<HTMLDivElement>(null);

	const header = ['code', 'description'];

	const label = {
		code: t('articleFamily.code'),
		description: t('articleFamily.description'),
	};

	const order = ['code', 'description'];

	const filters: TFilterField[] = [
		{ key: 'code', label: t('articleFamily.code'), type: 'text' },
		{ key: 'description', label: t('articleFamily.description'), type: 'text' },
	];

	const { data, status, error } = useAppSelector(
		(state) => state.articleFamilies.articleFamilyList,
	);

	const deleteArticleFamilyState = useAppSelector(
		(state) => state.articleFamilies.delete,
	);

	const formatDataToDisplay = (families: ArticleFamilyDTO[]) => {
		return families.map((item) => ({
			id: item.id,
			code: item.code ?? '',
			description: item.description ?? '',
			lock: item.lock ?? 0,
		}));
	};

	const formattedRows = formatDataToDisplay(data ?? []);

	const handleEdit = (row: ArticleFamilyDTO) => {
		onEdit((data ?? []).find((item) => item.id === row?.id));
	};

	return (
		<div className={classes.table}>
			{(() => {
				switch (status) {
					case 'FAIL':
						return (
							<InfoBox
								type="error"
								message={
									error?.message
										? t(error?.message)
										: t('common.somethingwrong')
								}
							/>
						);
					case 'LOADING':
						return (
							<CircularProgress
								style={{ marginLeft: '50%', position: 'relative' }}
							/>
						);

					case 'SUCCESS':
						return (
							<>
								<Table
									rowData={formattedRows}
									rawData={formattedRows}
									tableHeader={header}
									labelData={label}
									columnsOrder={order}
									rowsPerPage={10}
									isCollapsabile={false}
									onEdit={handleEdit}
									onDelete={onDelete}
									filterColumns={filters}
									showEmptyCell={false}
									rowKey="code"
									manualFilter={false}
									headerActions={headerActions}
								/>
								{deleteArticleFamilyState.isLoading && (
									<div ref={infoBoxRef} className="info-box-container">
										<InfoBox
											type="info"
											message={t('articleFamily.deleting')}
										/>
									</div>
								)}
								{deleteArticleFamilyState.status === 'FAIL' && (
									<div ref={infoBoxRef} className="info-box-container">
										<InfoBox
											type="error"
											message={
												deleteArticleFamilyState.error?.message
													? t(deleteArticleFamilyState.error?.message)
													: t('common.somethingwrong')
											}
										/>
									</div>
								)}
								<ConfirmationDialog
									isOpen={deleteArticleFamilyState.status === 'SUCCESS'}
									title={t('articleFamily.deleted')}
									icon={checkIcon}
									info={t('articleFamily.deleteSuccess')}
									primaryButtonLabel="Ok"
									handlePrimaryButtonClick={() => {
										dispatch(getArticleFamilies(undefined));
										dispatch(deleteArticleFamilyReset());
									}}
									handleSecondaryButtonClick={() => ({})}
								/>
							</>
						);
					case 'SUCCESS_EMPTY':
						return <InfoBox type="info" message={t('common.emptydata')} />;
					default:
						return;
				}
			})()}
		</div>
	);
};

export default ArticleFamiliesTable;
