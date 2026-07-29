import { ChevronLeft, OpenInNew } from '@mui/icons-material';
import {
    Backdrop,
    Button,
    CircularProgress,
    IconButton,
    Tooltip,
} from '@mui/material';
import { isEmpty } from 'lodash';
import moment from 'moment';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate, useParams } from 'react-router';
import { useAppDispatch, useAppSelector } from '~/libraries/hooks/redux';
import {
    getInstancePreview,
    getInstancePreviewReset,
    getStudySeriesReset,
    getStudySeriesWithInstances,
    getStudySeriesWithInstancesReset,
    type SeriesWithInstances,
} from '~/state/radiology';
import InfoBox from '../../infoBox/InfoBox';
import type { TFilterField } from '../../table/filter/types';
import Table from '../../table/Table';
import { useViewInOrthanc } from '../hooks';
import { Instances } from './instances/Instances';
import { Preview } from './preview/Preview';
import './styles.scss';

export const Series = () => {
	const { t, i18n } = useTranslation();
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const { studyId } = useParams();
	const { state: study } = useLocation();

	const [openPreview, setOpenPreview] = useState(false);

	const seriesState = useAppSelector(
		(state) => state.radiology.seriesWithInstances,
	);
	const previewState = useAppSelector((state) => state.radiology.preview);

	const header = ['title', 'lastUpdate', 'instances'];
	const dateFields = ['lastUpdate'];

	const label = {
		title: t('radiology.series.title'),
		status: t('radiology.series.status'),
		operators: t('radiology.series.operators'),
		instances: t('radiology.series.instances'),
		station: t('radiology.series.station'),
		expectedInstances: t('radiology.series.expectedInstances'),
		lastUpdate: t('radiology.series.lastUpdate'),
	};

	const order = ['lastUpdate', 'instances'];

	const filters: TFilterField[] = [
		{
			key: 'title',
			label: t('radiology.series.title'),
			type: 'text',
		},
		{
			key: 'lastUpdate',
			label: t('radiology.series.lastUpdate'),
			type: 'date',
		},
		{
			key: 'instances',
			label: t('radiology.series.instances'),
			type: 'number',
		},
	];

	/* =======================
	   DATA FETCHING
	======================= */

	useEffect(() => {
		if (studyId) {
			dispatch(getStudySeriesWithInstances(studyId));
		}
	}, [dispatch, studyId]);

	useEffect(() => {
		return () => {
			dispatch(getStudySeriesWithInstancesReset());
		};
	}, [dispatch]);

	useEffect(() => {
		return () => {
			dispatch(getStudySeriesReset());
			if (previewState.status !== 'IDLE') {
				dispatch(getInstancePreviewReset());
			}
		};
	}, [dispatch, previewState.status]);

	/* =======================
	   HELPERS
	======================= */

	const formatDataToDisplay = (data: SeriesWithInstances[]) =>
		data.map((series) => ({
			id: series.id ?? '',
			title: isEmpty(series.series?.seriesDescription)
				? '--'
				: series.series?.seriesDescription,
			instancesData: series.instances,
			instances: series.instancesIds?.length ?? 0,
			expectedInstances: series.expectedNumberOfInstances ?? '',
			lastUpdate: series.lastUpdate
				? moment(series.lastUpdate).locale(i18n.language).format('L')
				: '',
			operators: series.series?.operatorsName ?? '',
			protocol: series.series?.protocolName ?? '',
			station: series.series?.stationName ?? '',
			status: series.status ?? '',
		}));

	const navigateToStudies = useCallback(() => {
		navigate('..');
	}, [navigate]);

	const handlePreview = useCallback(
		(row: any) => () => {
			dispatch(getInstancePreview(row.id));
		},
		[dispatch],
	);

	const handleClosePreview = useCallback(() => {
		setOpenPreview(false);
		dispatch(getInstancePreviewReset());
	}, [dispatch]);

	useEffect(() => {
		if (previewState.hasSucceeded) {
			setOpenPreview(true);
		}
	}, [previewState.hasSucceeded]);

	const handleViewSeries = useViewInOrthanc('series');

	/* =======================
	   RENDER
	======================= */

	return (
		<div className="series">
			{(() => {
				switch (seriesState.status) {
					case 'FAIL':
						return (
							<InfoBox
								type="error"
								message={t(
									seriesState.error?.message ?? 'common.somethingwrong',
								)}
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
								<Button
									variant="text"
									color="secondary"
									onClick={navigateToStudies}
								>
									<ChevronLeft /> {t('radiology.series.backToStudies')}
								</Button>

								{study?.title && (
									<p className="series__studyTitle">
										{study.title}
										{study.date && ` | ${study.date}`}
									</p>
								)}

								{previewState.hasFailed && (
									<InfoBox
										type="error"
										message={t(
											previewState.error?.message ?? 'common.somethingwrong',
										)}
									/>
								)}

								<Table
									rowData={formatDataToDisplay(seriesState.data ?? [])}
									dateFields={dateFields}
									tableHeader={header}
									labelData={label}
									columnsOrder={order}
									rowsPerPage={5}
									isCollapsabile
									renderCustomActions={(row) => (
										<div className="series__actions">
											<Tooltip title={t('radiology.series.viewInOrthanc')}>
												<IconButton onClick={handleViewSeries(row)}>
													<OpenInNew />
												</IconButton>
											</Tooltip>
										</div>
									)}
									filterColumns={filters}
									rawData={(seriesState.data ?? []).map((series) => ({
										id: series.id ?? '',
										title: series.series?.seriesDescription ?? '',
										lastUpdate: series.lastUpdate
											? moment(series.lastUpdate).toISOString()
											: '',
									}))}
									manualFilter={false}
									rowKey="id"
									customRenderDetails={(row) => (
										<Instances
											onPreview={handlePreview}
											data={row.instancesData}
										/>
									)}
								/>

								<Backdrop
									sx={{
										color: '#fff',
										zIndex: (theme) => theme.zIndex.drawer + 1,
									}}
									open={previewState.isLoading}
								>
									<CircularProgress color="inherit" />
								</Backdrop>

								<Preview open={openPreview} onClose={handleClosePreview} />
							</>
						);

					case 'SUCCESS_EMPTY':
						return <InfoBox type="info" message={t('common.emptydata')} />;

					default:
						return null;
				}
			})()}
		</div>
	);
};
