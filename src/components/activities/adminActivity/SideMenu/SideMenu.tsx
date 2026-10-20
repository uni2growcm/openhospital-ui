import {
	AirlineSeatFlat,
	ArrowForwardIosRounded,
	AssignmentInd,
	Badge,
	BlurCircular,
	Category,
	GroupWork,
	Healing,
	LocalDrink,
	LocalHospitalSharp,
	People,
	Percent,
	Public,
	SupervisedUserCircle,
	Tune,
} from '@mui/icons-material';
import { type ReactNode, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';
import { PATHS } from '~/consts';
import { useAppSelector } from '../../../../libraries/hooks/redux';
import Button from '../../../accessories/button/Button';
import { MenuItem } from '../../../accessories/menuItem';
import type { IAdminSection } from '../types';
import classes from './SideMenu.module.scss';

const SideMenu = () => {
	const { t } = useTranslation();

	const navigate = useNavigate();
	const location = useLocation();

	const hospital = useAppSelector((state) => state.hospital.getHospital);

	const changeAdminSection = useCallback(
		(section: IAdminSection) => {
			if (section === 'articleFamilies') {
				navigate(PATHS.admin_article_families);
				return;
			}
			if (section === 'reductionPlans') {
				navigate(PATHS.admin_reductionplans);
				return;
			}
			navigate(`${PATHS.admin}/${section}`);
		},
		[navigate],
	);

	const menuItems: { key: IAdminSection; icon: ReactNode }[] = [
		{
			key: 'wards',
			icon: <AirlineSeatFlat fontSize="small" />,
		},
		{
			key: 'staff',
			icon: <Badge fontSize="small" />,
		},
		{
			key: 'diseases',
			icon: <BlurCircular fontSize="small" />,
		},
		{
			key: 'exams',
			icon: <AssignmentInd fontSize="small" />,
		},
		{
			key: 'operations',
			icon: <Healing fontSize="small" />,
		},
		{
			key: 'vaccines',
			icon: <LocalDrink fontSize="small" />,
		},
		{
			key: 'suppliers',
			icon: <SupervisedUserCircle fontSize="small" />,
		},
		{
			key: 'articleFamilies',
			icon: <Category fontSize="small" />,
		},
		{
			key: 'countries',
			icon: <Public fontSize="small" />,
		},
		{
			key: 'users',
			icon: <People fontSize="small" />,
		},
		{
			key: 'reductionPlans',
			icon: <Percent fontSize="small" />,
		},
		{
			key: 'settings',
			icon: <Tune fontSize="small" />,
		},
		{
			key: 'types',
			icon: <GroupWork fontSize="small" />,
		},
	];

	return (
		<div data-cy="admin-side-menu" className={classes.menu}>
			{menuItems.map((item) => (
				<MenuItem
					key={item.key}
					icon={item.icon}
					label={t(`nav.${item.key}`)}
					selected={
						item.key === 'articleFamilies'
							? location.pathname.includes('article-families')
							: item.key === 'reductionPlans'
								? location.pathname.includes('reduction-plans')
								: location.pathname
										.slice(location.pathname.lastIndexOf('admin') + 6)
										.startsWith(item.key)
					}
					onClick={() => {
						changeAdminSection(item.key);
					}}
					trailingIcon={<ArrowForwardIosRounded fontSize="small" />}
				/>
			))}
			<h6 className={classes.label}>{t('nav.hospital')}</h6>
			<MenuItem
				data-cy="hospital-infos"
				icon={<LocalHospitalSharp fontSize="small" />}
				label={t(`nav.hospitalInfo`)}
				expandedContent={
					<div className={classes.hospitalData}>
						{hospital.data &&
							Object.entries(hospital.data)
								.filter((entry) => entry[0] !== 'lock')
								.map((entry) => (
									<div key={entry[0]} className={classes.item}>
										<span className={classes.labelSmall}>
											{t(`hospital.${entry[0]}`)}
										</span>
										<span className={classes.value}>{entry[1] ?? '---'}</span>
									</div>
								))}
						<Button
							type="button"
							variant="text"
							dataCy="edit-hospital"
							className={classes.editButton}
							onClick={() => {
								navigate(PATHS.admin_hospital_edit);
							}}
						>
							{t('hospital.editHospital')}
						</Button>
					</div>
				}
			/>
		</div>
	);
};

export default SideMenu;
