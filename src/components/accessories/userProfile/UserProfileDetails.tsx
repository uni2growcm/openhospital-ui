import { Chip } from '@mui/material';
import type { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import './styles.scss';
import type { IUserProfileDetailsProps } from './types';

export const UserProfileDetails: FunctionComponent<
	IUserProfileDetailsProps
> = ({ userName, userGroup, description, permissions, user }) => {
	const { t } = useTranslation();

	const displayedUserName = userName ?? user?.userName ?? '-';
	const displayedGroup = userGroup ?? user?.userGroupName;
	const displayedDescription = description ?? user?.desc;
	const displayedPermissions = permissions ?? [];

	return (
		<section className="userProfileSection" data-cy="user-profile-details">
			<div className="userProfileSection__header">
				<h3>{t('profile.details')}</h3>
				<p>{t('profile.detailsDescription')}</p>
			</div>
			<div className="userProfileDetails">
				<div className="userProfileDetails__row">
					<span className="userProfileDetails__label">
						{t('profile.username')}
					</span>
					<span className="userProfileDetails__value">{displayedUserName}</span>
				</div>
				<div className="userProfileDetails__row">
					<span className="userProfileDetails__label">
						{t('profile.group')}
					</span>
					<span className="userProfileDetails__value">
						{displayedGroup
							? `${displayedGroup.code}${
									displayedGroup.desc ? ` - ${displayedGroup.desc}` : ''
								}`
							: '-'}
					</span>
				</div>
				<div className="userProfileDetails__row">
					<span className="userProfileDetails__label">
						{t('profile.description')}
					</span>
					<span className="userProfileDetails__value">
						{displayedDescription ?? t('profile.noDescription')}
					</span>
				</div>
				<div className="userProfileDetails__row">
					<span className="userProfileDetails__label">
						{t('profile.permissions')}
					</span>
					<span className="userProfileDetails__permissions">
						{displayedPermissions.length > 0
							? displayedPermissions.map((permission) => (
									<Chip
										key={permission}
										size="small"
										label={permission}
										className="userProfileDetails__permission"
									/>
								))
							: '-'}
					</span>
				</div>
			</div>
		</section>
	);
};
