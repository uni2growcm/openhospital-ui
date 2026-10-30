import { type FunctionComponent, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { PATHS } from '../../../consts';
import { useAppDispatch, useAppSelector } from '../../../libraries/hooks/redux';
import { usePermission } from '../../../libraries/permissionUtils/usePermission';
import { getUserById, getUserByIdReset } from '../../../state/users';
import AppHeader from '../appHeader/AppHeader';
import Footer from '../footer/Footer';
import { ChangePasswordForm } from './ChangePasswordForm';
import { PersonalSettings } from './PersonalSettings';
import './styles.scss';
import { UserProfileDetails } from './UserProfileDetails';

export const UserProfile: FunctionComponent = () => {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();

	const userCredentials = useAppSelector(
		(state) => state.main.authentication.data,
	);
	const user = useAppSelector((state) => state.users.getById.data);
	const canReadUsers = usePermission('users.read');

	const username = userCredentials?.username ?? '';

	useEffect(() => {
		if (username && canReadUsers) {
			dispatch(getUserById(username));
		}
		return () => {
			dispatch(getUserByIdReset());
		};
	}, [dispatch, username, canReadUsers]);

	const breadcrumbMap = {
		[t('nav.userProfile')]: PATHS.user_profile,
	};

	return (
		<div data-cy="user-profile-page" className="userProfile">
			<AppHeader
				userCredentials={userCredentials}
				breadcrumbMap={breadcrumbMap}
			/>
			<div className="userProfile__background">
				<div className="userProfile__content">
					<h2 data-cy="activity-title">{t('profile.title')}</h2>
					<div className="userProfile__sections">
						<UserProfileDetails
							userName={username}
							userGroup={userCredentials?.userGroup}
							description={user?.desc}
							permissions={userCredentials?.permissions}
							user={user}
						/>
						<ChangePasswordForm userName={username} />
						<PersonalSettings userName={username} />
					</div>
				</div>
			</div>
			<Footer />
		</div>
	);
};
