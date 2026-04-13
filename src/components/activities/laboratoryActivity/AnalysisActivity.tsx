import { type FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router';
import Analysis from '~/components/accessories/laboratory/analysis/Analysis';
import { useAppSelector } from '~/libraries/hooks/redux';
import { PATHS } from '../../../consts';
import { Permission } from '../../../libraries/permissionUtils/Permission';
import AppHeader from '../../accessories/appHeader/AppHeader';
import Footer from '../../accessories/footer/Footer';
import { HospitalInfo } from '../../accessories/hospitalInfo/HospitalInfo';
import './styles.scss';

export const AnalysisActivity: FC = () => {
	const { t } = useTranslation();
	const location = useLocation();
	const breadcrumbMap = useMemo(() => {
		if (location.pathname.includes('new'))
			return {
				[t('nav.analysis')]: PATHS.analysis,
			};
		if (location.pathname.includes('edit'))
			return {
				[t('nav.analysis')]: PATHS.analysis,
			};
		return {
			[t('nav.analysis')]: PATHS.analysis,
		};
	}, [location.pathname, t]);

	const userCredentials = useAppSelector(
		(state) => state.main.authentication.data,
	);

	return (
		<div className="labs">
			<AppHeader
				userCredentials={userCredentials}
				breadcrumbMap={breadcrumbMap}
			/>
			<div className="labs__background">
				<div className="labs__content">
					<HospitalInfo />
					<Permission require="laboratories.access">
						<Analysis />
					</Permission>
				</div>
			</div>
			<Footer />
		</div>
	);
};

export default AnalysisActivity;
