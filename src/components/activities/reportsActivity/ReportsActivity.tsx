import { type FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '~/libraries/hooks/redux';
import { PATHS } from '../../../consts';
import { Permission } from '../../../libraries/permissionUtils/Permission';
import AppHeader from '../../accessories/appHeader/AppHeader';
import Footer from '../../accessories/footer/Footer';
import { HospitalInfo } from '../../accessories/hospitalInfo/HospitalInfo';
import { Reports } from '../../accessories/reports/Reports';
import './styles.scss';

export const ReportsActivity: FC = () => {
	const { t } = useTranslation();
	const breadcrumbMap = useMemo(
		() => ({
			[t('nav.reports')]: PATHS.reports,
		}),
		[t],
	);

	const userCredentials = useAppSelector(
		(state) => state.main.authentication.data,
	);

	return (
		<div className="reportsActivity">
			<AppHeader
				userCredentials={userCredentials}
				breadcrumbMap={breadcrumbMap}
			/>
			<div className="reportsActivity__background">
				<div className="reportsActivity__content">
					<HospitalInfo />
					<Permission require="reports.read">
						<Reports />
					</Permission>
				</div>
			</div>
			<Footer />
		</div>
	);
};

export default ReportsActivity;
