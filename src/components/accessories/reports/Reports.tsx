import { Description, Print } from '@mui/icons-material';
import {
	Autocomplete,
	CircularProgress,
	IconButton,
	Tab,
	Tabs,
	TextField,
	Tooltip,
} from '@mui/material';
import { type FC, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import InfoBox from '~/components/accessories/infoBox/InfoBox';
import Table from '~/components/accessories/table/Table';
import { downloadBlob } from '~/libraries/downloadUtils/downloadUtils';
import { useAppDispatch, useAppSelector } from '~/libraries/hooks/redux';
import { getStatisticReports } from '~/state/reports';
import {
	type IReportDefinition,
	REPORT_CATEGORIES,
	type TReportCategory,
	type TReportFormat,
	type TReportParam,
	useReportDefinitions,
} from './catalog';
import { ReportParametersDialog } from './ReportParametersDialog';
import { ReportPreviewDialog } from './ReportPreviewDialog';
import './styles.scss';

type TTab = 'all' | TReportCategory;

type TPreview = { blob: Blob; fileName: string; title: string };

export const Reports: FC = () => {
	const { t, i18n } = useTranslation();
	const dispatch = useAppDispatch();
	const reports = useReportDefinitions();
	const statisticsState = useAppSelector((state) => state.reports.statistics);

	const [currentTab, setCurrentTab] = useState<TTab>('all');
	const [search, setSearch] = useState('');
	const [selected, setSelected] = useState<IReportDefinition>();
	const [preview, setPreview] = useState<TPreview>();

	useEffect(() => {
		dispatch(getStatisticReports(i18n.language));
	}, [dispatch, i18n.language]);

	const tabs = useMemo(
		() =>
			REPORT_CATEGORIES.filter((category) =>
				reports.some((report) => report.category === category),
			),
		[reports],
	);

	const visibleReports = useMemo(() => {
		const query = search.trim().toLowerCase();
		return reports.filter(
			(report) =>
				(currentTab === 'all' || report.category === currentTab) &&
				(!query ||
					report.title.toLowerCase().includes(query) ||
					report.code.toLowerCase().includes(query)),
		);
	}, [reports, currentTab, search]);

	const describeParams = (params: TReportParam[]) =>
		params.length === 0
			? t('reports.params.none')
			: params.map((param) => t(`reports.params.${param}`)).join(', ');

	const rowData = visibleReports.map((report) => ({
		code: report.code,
		description: report.title,
		parameters: describeParams(report.params),
		category: t(`reports.categories.${report.category}`),
	}));

	const findReport = (code: string) =>
		visibleReports.find((report) => report.code === code);

	const handlePrinted = (
		blob: Blob,
		format: TReportFormat,
		fileName: string,
	) => {
		if (!selected) return;
		if (format === 'xlsx') {
			downloadBlob(blob, fileName);
		} else {
			setPreview({ blob, fileName, title: selected.title });
		}
		setSelected(undefined);
	};

	const renderActions = (row: { code: string }) => {
		const report = findReport(row.code);
		if (!report) return null;
		return (
			<>
				<Tooltip title={t('reports.actions.print')}>
					<IconButton
						size="small"
						data-cy={`print-report-${report.code}`}
						onClick={() => setSelected(report)}
					>
						<Print color="secondary" />
					</IconButton>
				</Tooltip>
				{report.formats.includes('xlsx') && (
					<Tooltip title={t('reports.actions.excel')}>
						<IconButton
							size="small"
							data-cy={`export-excel-${report.code}`}
							onClick={() => setSelected(report)}
						>
							<Description className="reports__excelIcon" />
						</IconButton>
					</Tooltip>
				)}
			</>
		);
	};

	return (
		<div className="reports" data-cy="reports-list">
			<h3 className="reports__title">{t('reports.title')}</h3>
			<p className="reports__help">{t('reports.help')}</p>

			<Tabs
				value={currentTab}
				onChange={(_e, value: TTab) => setCurrentTab(value)}
				aria-label="reports"
				variant="scrollable"
				scrollButtons="auto"
				data-cy="reports-tabs"
			>
				<Tab label={t('reports.categories.all')} value="all" />
				{tabs.map((category) => (
					<Tab
						key={category}
						label={t(`reports.categories.${category}`)}
						value={category}
					/>
				))}
			</Tabs>

			<div className="reports__search">
				<Autocomplete
					freeSolo
					size="small"
					options={visibleReports.map((report) => report.title)}
					inputValue={search}
					onInputChange={(_e, value) => setSearch(value)}
					renderInput={(params) => (
						<TextField
							{...params}
							label={t('reports.search')}
							data-cy="reports-autocomplete"
						/>
					)}
				/>
			</div>

			{statisticsState.status === 'LOADING' && (
				<div className="reports__loader">
					<CircularProgress size={24} />
				</div>
			)}
			{statisticsState.hasFailed && (
				<InfoBox
					type="error"
					message={
						statisticsState.error?.message ?? t('reports.errors.statistics')
					}
				/>
			)}

			<div className="reports__table" data-cy="reports-table">
				<Table
					rowData={rowData}
					tableHeader={[
						'code',
						'description',
						...(currentTab === 'all' ? ['category'] : []),
						'parameters',
					]}
					labelData={{
						code: t('reports.columns.code'),
						description: t('reports.columns.description'),
						category: t('reports.columns.category'),
						parameters: t('reports.columns.parameters'),
					}}
					columnsOrder={['code', 'description', 'category']}
					rowsPerPage={15}
					showEmptyCell={false}
					rowKey="code"
					renderCustomActions={renderActions}
				/>
			</div>

			{selected && (
				<ReportParametersDialog
					open={!!selected}
					report={selected}
					onClose={() => setSelected(undefined)}
					onPrinted={handlePrinted}
				/>
			)}

			<ReportPreviewDialog
				title={preview?.title ?? ''}
				blob={preview?.blob}
				fileName={preview?.fileName ?? ''}
				onClose={() => setPreview(undefined)}
			/>
		</div>
	);
};

export default Reports;
