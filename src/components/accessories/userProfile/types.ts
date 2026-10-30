import type { UserDTO, UserGroupDTO } from '../../../generated';
import type { TPermission } from '../../../types';

export interface IUserProfileDetailsProps {
	userName?: string;
	userGroup?: UserGroupDTO;
	description?: string;
	permissions?: TPermission[];
	user?: UserDTO;
}

export interface IChangePasswordFormProps {
	userName: string;
}

export interface IPersonalSettingsProps {
	userName: string;
}

export interface IChangePasswordValues {
	oldPasswd: string;
	newPasswd: string;
	confirmPasswd: string;
}
