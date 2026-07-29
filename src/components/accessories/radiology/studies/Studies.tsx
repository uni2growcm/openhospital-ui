import { ChevronRight } from '@mui/icons-material';
import { Button, CircularProgress } from '@mui/material';
import moment from 'moment';
import { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import './styles.scss';
import { isEmpty } from 'lodash';
import type { StudyResponse } from '~/generated';
import { useAppDispatch, useAppSelector } from '~/libraries/hooks/redux';
import { getPatientStudies, getPatientStudiesReset } from '~/state/radiology';
import InfoBox from '../../infoBox/InfoBox';
import type { TFilterField } from '../../table/filter/types';
import Table from '../../table/Table';

export const Studies = () => {
	const { t, i18n } = useTranslation();
	const dispatch = useAppDispatch();

	const navigate = useNavigate();

	const patient = useAppSelector(
		(state) => state.patients.selectedPatient.data,
	);

	const studiesState = useAppSelector((state) => state.radiology.studies);

	const header = ['title', 'date', 'series'];
	const dateFields = ['date'];

	const label = {
		title: t('radiology.studies.title'),
		date: t('radiology.studies.date'),
		series: t('radiology.studies.series'),
		lastUpdate: t('radiology.studies.lastUpdate'),
		referrencingPhysician: t('radiology.studies.referrencingPhysician'),
		institution: t('radiology.studies.institution'),
		time: t('radiology.studies.time'),
	};
	const order = ['date', 'series'];

	const filters: TFilterField[] = [
		{
			key: 'title',
			label: t('radiology.studies.title'),
			type: 'text',
		},
		{ key: 'date', label: t('radiology.studies.date'), type: 'date' },
		{ key: 'series', label: t('radiology.studies.series'), type: 'number' },
	];

	useEffect(() => {
		if (patient?.code) {
			dispatch(getPatientStudies(patient.code.toString()));
		}
	}, [dispatch, patient]);

	useEffect(() => {
		return () => {
			dispatch(getPatientStudiesReset());
		};
	}, [dispatch]);

	const formatDataToDisplay = (data: StudyResponse[]) => {
		return data.map((study) => {
			return {
				id: study.id ?? '',
				title: isEmpty(study.study?.description)
					? '--'
					: study.study?.description,
				date: study.study?.date
					? moment(study.study.date, 'YYYYMMDD')
							.locale(i18n.language)
							.format('L')
					: '',
				series: study.seriesIds?.length ?? 0,
				lastUpdate: study.lastUpdate
					? moment(study.lastUpdate).locale(i18n.language).format('L')
					: '',
				time: study.study?.time
					? moment(study.study?.time, 'HHmmss')
							.locale(i18n.language)
							.format('LTS')
					: '',
				referringPhysician: study.study?.referringPhysicianName ?? '',
				institution: study.study?.institutionName ?? '',
			};
		});
	};

	const navigateToSeries = useCallback(
		(row: any) => () => {
			navigate(`./${row.id}/series`, { state: row });
		},
		[navigate],
	);

	return (
		<div className="studies">
			{(() => {
				switch (studiesState.status) {
					case 'FAIL':
						return (
							<InfoBox
								type="error"
								message={t(
									studiesState.error?.message ?? 'common.somethingwrong',
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
								<Table
									rowData={formatDataToDisplay(studiesState.data ?? [])}
									dateFields={dateFields}
									tableHeader={header}
									labelData={label}
									columnsOrder={order}
									rowsPerPage={5}
									isCollapsabile={true}
									renderCustomActions={(row) => (
										<Button
											variant="contained"
											color="secondary"
											onClick={navigateToSeries(row)}
										>
											<span>{t('radiology.studies.viewSeries')}</span>
											<ChevronRight />
										</Button>
									)}
									filterColumns={filters}
									rawData={(studiesState.data ?? []).map((study) => ({
										id: study.id ?? '',
										title: study.study?.description ?? '',
										date: study.study?.date
											? (study.study.time
													? moment(
															study.study.date + study.study.time,
															'YYYYMMDDHHmmss',
														)
													: moment(study.study.date, 'YYYYMMDD')
												).toISOString()
											: '',
										series: study.seriesIds?.length ?? 0,
									}))}
									manualFilter={false}
									rowKey="id"
								/>
							</>
						);

					case 'SUCCESS_EMPTY':
						return (
							<>
								<InfoBox type="info" message={t('common.emptydata')} />
							</>
						);

					default:
						return;
				}
			})()}
		</div>
	);
};
