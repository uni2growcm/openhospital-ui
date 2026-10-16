import { Inventory, Receipt } from '@mui/icons-material';
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { useAppSelector } from '~/libraries/hooks/redux';
import { PATHS } from '../../../consts';
import AppHeader from '../../accessories/appHeader/AppHeader';
import Footer from '../../accessories/footer/Footer';
import LargeButton from '../../accessories/largeButton/LargeButton';
import { AccountingActivityContent } from './AccountingActivityContent';
import './styles.scss';

const actions = [
	{ icon: Receipt, key: 'manageBills' },
	{ icon: Inventory, key: 'archiveBills' },
];

export const AccountingActivity: FC = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();

	const { userCredentials } = useAppSelector((state) => ({
		userCredentials: state.main.authentication?.data,
	}));

	const breadcrumbMap = {
		[t('nav.accounting')]: PATHS.accounting,
	};

	const handleActionClick = (key: string) => {
		if (key === 'manageBills') {
			navigate(PATHS.accounting_bills);
		}
	};

	return (
		<div data-cy="accounting-activity" className="accounting">
			<AppHeader
				userCredentials={userCredentials ? userCredentials : {}}
				breadcrumbMap={breadcrumbMap}
			/>
			<div className="accounting__background">
				<div className="accounting__content">
					<AccountingActivityContent
						title={t('nav.accounting')}
						data-cy="accounting-home"
					>
						<div className="accounting__actions">
							{actions.map((action) => (
								<LargeButton
									key={action.key}
									handleClick={() => handleActionClick(action.key)}
									data-cy={action.key}
								>
									<div className="largeButton__inner">
										<action.icon />
										<div className="largeButton__inner__label">
											{t(`accounting.${action.key}`)}
										</div>
									</div>
								</LargeButton>
							))}
						</div>
					</AccountingActivityContent>
				</div>
			</div>
			<Footer />
		</div>
	);
};

export default AccountingActivity;
