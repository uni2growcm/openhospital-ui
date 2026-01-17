import { CircularProgress, Tab, Tabs } from '@mui/material';
import type React from 'react';
import { type FC, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { AdminActivityContent } from '~/components/activities/adminActivity';
import type { SettingDTO } from '~/generated';
import { useAppDispatch, useAppSelector } from '~/libraries/hooks/redux';
import {
	getAllSettings,
	resetAllSettingReset,
	resetAllSettings,
} from '~/state/settings';
import checkIcon from '../../../../assets/check-icon.png';
import warningIcon from '../../../../assets/warning-icon.png';
import ConfirmationDialog from '../../confirmationDialog/ConfirmationDialog';
import InfoBox from '../../infoBox/InfoBox';
import { organizeByCategory } from './consts';
import EditSetting from './editSetting/EditSetting';
import classes from './Settings.module.scss';
import SettingsTable from './settingsTable/SettingsTable';

export const Settings = () => {
	const dispatch = useAppDispatch();
	const { t } = useTranslation();
	const settingsState = useAppSelector((state) => state.settings.getAll);
	const resetAllState = useAppSelector((state) => state.settings.resetAll);
	const [currentTab, setCurrentTab] = useState<string>('all');
	const [setting, setSetting] = useState<SettingDTO | undefined>(undefined);
	const [editDialogOpen, setEditDialogOpen] = useState<boolean>(false);
	const [resetDialogOpen, setResetDialogOpen] = useState<boolean>(false);

	useEffect(() => {
		dispatch(getAllSettings());
	}, [dispatch]);

	const handleTabChange = (_event: React.SyntheticEvent, newValue: string) => {
		setCurrentTab(newValue);
	};

	const onEdit = (item: SettingDTO) => {
		const matchedSetting = settingsState.data?.find(
			(s: SettingDTO) => s.code === item.code,
		);

		if (matchedSetting) {
			setSetting(matchedSetting);
			setEditDialogOpen(true);
		}
	};

	const handleEditSucceed = () => {
		handleCloseEditDialog();
		dispatch(getAllSettings());
	};

	const handleResetAll = () => {
		dispatch(resetAllSettings());
	};

	const handleResetSucceed = () => {
		dispatch(resetAllSettingReset());
		setResetDialogOpen(false);
		dispatch(getAllSettings());
	};

	const handleCloseEditDialog = () => {
		setEditDialogOpen(false);
		setSetting(undefined);
	};

	const settingsByCategories = useMemo((): Record<string, SettingDTO[]> => {
		return settingsState.data ? organizeByCategory(settingsState.data) : {};
	}, [settingsState.data]);

	const TabContent: FC<{
		current: string;
		tab: string;
		items: SettingDTO[];
	}> = ({ current, tab, items }) => {
		return (
			current === tab && (
				<SettingsTable
					category={tab}
					onEdit={onEdit}
					items={items}
					onResetAll={() => setResetDialogOpen(true)}
				/>
			)
		);
	};

	return (
		<AdminActivityContent title={t('nav.settings')}>
			<div className={classes.settings} data-cy="settings-table">
				{(() => {
					switch (settingsState.status) {
						case 'LOADING':
							return (
								<CircularProgress
									style={{ marginLeft: '50%', position: 'relative' }}
								/>
							);
						case 'FAIL':
							return (
								<InfoBox type="error" message={settingsState.error?.message} />
							);
						case 'SUCCESS':
							return (
								<>
									<Tabs
										value={currentTab}
										onChange={handleTabChange}
										aria-label="settings"
										variant="standard"
										sx={{
											flexWrap: 'wrap',
											'& .MuiTabs-flexContainer': {
												flexWrap: 'wrap',
											},
										}}
									>
										{Object.keys(settingsByCategories).map((tab) => (
											<Tab
												label={t(`settings.categories.${tab}`)}
												key={tab}
												value={tab}
											/>
										))}
									</Tabs>

									{Object.keys(settingsByCategories).map((tab) => (
										<TabContent
											current={currentTab}
											tab={tab}
											key={tab}
											items={settingsByCategories[tab]}
										/>
									))}

									{setting && (
										<EditSetting
											onClose={handleCloseEditDialog}
											onSucceed={handleEditSucceed}
											open={editDialogOpen}
											setting={setting}
										/>
									)}

									<ConfirmationDialog
										isOpen={resetDialogOpen}
										title={t('settings.resetAllSettings')}
										info={t('settings.confirmresetall')}
										icon={warningIcon}
										primaryButtonLabel={t('common.ok')}
										secondaryButtonLabel={t('common.discard')}
										handlePrimaryButtonClick={handleResetAll}
										handleSecondaryButtonClick={() => setResetDialogOpen(false)}
									/>

									<ConfirmationDialog
										isOpen={resetAllState.hasSucceeded}
										title={t('settings.reset')}
										icon={checkIcon}
										info={t('settings.successfullyReset')}
										primaryButtonLabel={t('common.ok')}
										handlePrimaryButtonClick={handleResetSucceed}
										handleSecondaryButtonClick={() => ({})}
									/>

									{resetAllState.hasFailed && (
										<div className="info-box-container">
											<InfoBox
												type="error"
												message={
													resetAllState.error?.message ??
													t('common.somethingwrong')
												}
											/>
										</div>
									)}
								</>
							);
						default:
							return null;
					}
				})()}
			</div>
		</AdminActivityContent>
	);
};
