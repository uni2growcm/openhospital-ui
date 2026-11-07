import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '~/libraries/hooks/redux';
import { PATHS } from '../../../consts';
import AppHeader from '../../accessories/appHeader/AppHeader';
import Footer from '../../accessories/footer/Footer';
import LargeButton from '../../accessories/largeButton/LargeButton';
import { MATERNITY_ACTIONS } from './consts';
import './styles.scss';

export const MaternityActivity: FC = () => {
	const { t } = useTranslation();

	const breadcrumbMap = {
		[t('nav.maternity')]: PATHS.maternity,
	};

	const userCredentials = useAppSelector(
		(state) => state.main.authentication.data,
	);

	return (
		<div data-cy="maternity-activity" className="maternity">
			<AppHeader
				userCredentials={userCredentials}
				breadcrumbMap={breadcrumbMap}
			/>
			<div className="maternity__background">
				<div className="maternity__content">
					<div className="maternityActivity__content">
						<span className="maternityActivity__content_title">
							{t('maternity.title')}
						</span>
						<div className="maternity__actions">
							{MATERNITY_ACTIONS.map((action) => (
								<LargeButton
									key={action.id}
									data-cy={`card-${action.id}`}
									className="maternity__actions__button"
								>
									<div className="largeButton__inner">
										<action.Icon sx={{ fontSize: 40 }} />
										<div className="largeButton__inner__label">
											{t(action.translationKey)}
										</div>
									</div>
								</LargeButton>
							))}
						</div>
					</div>
				</div>
			</div>
			<Footer />
		</div>
	);
};

export default MaternityActivity;
