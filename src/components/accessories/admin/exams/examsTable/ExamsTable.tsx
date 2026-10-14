import { CircularProgress } from '@mui/material';
import { type ReactNode, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '~/libraries/hooks/redux';
import checkIcon from '../../../../../assets/check-icon.png';
import type { ExamDTO, ExamTypeDTO } from '../../../../../generated';
import { getArticleFamilies } from '../../../../../state/articleFamilies';
import { deleteExamReset, getExams } from '../../../../../state/exams';
import { getExamTypes } from '../../../../../state/types/exams';
import ConfirmationDialog from '../../../confirmationDialog/ConfirmationDialog';
import InfoBox from '../../../infoBox/InfoBox';
import type { TFilterField } from '../../../table/filter/types';
import Table from '../../../table/Table';
import type { ExamFormFieldName } from '../types';
import classes from './ExamsTable.module.scss';

interface IOwnProps {
	onDelete: (row: ExamDTO) => void;
	onEdit: (row: ExamDTO) => void;
	headerActions: ReactNode;
}

export const ExamsTable = ({ onDelete, onEdit, headerActions }: IOwnProps) => {
	const dispatch = useAppDispatch();
	const { t } = useTranslation();
	const infoBoxRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		dispatch(getExams());
		dispatch(getExamTypes());
		dispatch(getArticleFamilies(undefined));
	}, [dispatch]);

	const header: Array<ExamFormFieldName> = [
		'code',
		'examtype',
		'description',
		'articleFamily',
		'procedure',
		'defaultResult',
	];
	const examTypesOptions = useAppSelector(
		(state) =>
			state.types.exams.getAll.data?.map((item: ExamTypeDTO) => ({
				value: item.code ?? '',
				label: item.description ?? item.code ?? '',
			})) ?? [],
	);
	const articleFamiliesOptions = useAppSelector(
		(state) =>
			state.articleFamilies.articleFamilyList.data?.map((item) => ({
				value: `${item.code} - ${item.description}`,
				label: `${item.code} - ${item.description}`,
			})) ?? [],
	);

	const filters: TFilterField[] = [
		{
			key: 'examtype',
			label: t('exam.examtype'),
			type: 'select',
			options: examTypesOptions,
		},
		{ key: 'description', label: t('exam.description'), type: 'text' },
		{
			key: 'articleFamily',
			label: t('exam.articleFamily'),
			type: 'select',
			options: articleFamiliesOptions,
		},
		{ key: 'defaultResult', label: t('exam.defaultResult'), type: 'text' },
	];

	const label = {
		code: t('exam.code'),
		examtype: t('exam.examtype'),
		description: t('exam.description'),
		articleFamily: t('exam.articleFamily'),
		procedure: t('exam.procedure'),
		defaultResult: t('exam.defaultResult'),
	};
	const order: Array<ExamFormFieldName> = [
		'code',
		'examtype',
		'description',
		'articleFamily',
		'procedure',
		'defaultResult',
	];

	const { data, status, error } = useAppSelector(
		(state) => state.exams.examList,
	);

	const deleteExam = useAppSelector((state) => state.exams.examDelete);

	const formatDataToDisplay = (data: ExamDTO[]) => {
		return data.map((item) => {
			return {
				code: item.code ?? '',
				examtype: item.examtype?.description ?? '',
				description: item.description ?? '',
				articleFamily: item.articleFamily
					? `${item.articleFamily.code} - ${item.articleFamily.description}`
					: '',
				procedure: item.procedure ?? '',
				defaultResult: item.defaultResult ?? '',
			};
		});
	};

	const handleEdit = (row: ExamDTO) => {
		const examDTO = (data ?? []).find(
			(item) => item.code === row?.code,
		) as ExamDTO;
		onEdit(examDTO);
	};

	return (
		<div className={classes.table}>
			{(() => {
				switch (status) {
					case 'FAIL':
						return <InfoBox type="error" message={error?.message} />;
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
									rowData={formatDataToDisplay(data ?? [])}
									tableHeader={header}
									labelData={label}
									columnsOrder={order}
									rowsPerPage={10}
									isCollapsabile={false}
									onEdit={handleEdit}
									onDelete={onDelete}
									headerActions={headerActions}
									filterColumns={filters}
									rawData={(data ?? []).map((exam) => ({
										...exam,
										examtype: exam.examtype?.code,
									}))}
									manualFilter={false}
									rowKey="code"
								/>
								{deleteExam.status === 'FAIL' && (
									<div ref={infoBoxRef} className="info-box-container">
										<InfoBox
											type="error"
											message={deleteExam.error?.message || 'unknown error'}
										/>
									</div>
								)}
								<ConfirmationDialog
									isOpen={deleteExam.status === 'SUCCESS'}
									title={t('operation.deleted')}
									icon={checkIcon}
									info={t('operation.deleteSuccess')}
									primaryButtonLabel="Ok"
									handlePrimaryButtonClick={() => {
										dispatch(deleteExamReset());
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
