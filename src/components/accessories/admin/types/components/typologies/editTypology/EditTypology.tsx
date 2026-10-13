import { type FC, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate, useLocation, useParams } from 'react-router';
import { useAppDispatch, useAppSelector } from '~/libraries/hooks/redux';
import { PATHS } from '../../../../../../../consts';
import type { TypologyDTO } from '../../../../../../../generated';
import { setTypeMode } from '../../../../../../../state/types/config';
import {
	getTypologyByCode,
	getTypologyReset,
	updateTypology,
} from '../../../../../../../state/types/typologies';
import type { TypologyFamilyConfig } from '../typologyConfig';
import { getInitialFields } from '../typologyForm/consts';
import TypologyForm from '../typologyForm/TypologyForm';

interface IEditTypologyProps {
	config: TypologyFamilyConfig;
}

export const EditTypology: FC<IEditTypologyProps> = ({ config }) => {
	const dispatch = useAppDispatch();
	const { t } = useTranslation();
	const { state }: { state: TypologyDTO | undefined } = useLocation();
	const { code } = useParams();
	const update = useAppSelector((state) => state.types.typologies.update);
	const loadedTypology = useAppSelector(
		(state) => state.types.typologies.getTypology.data,
	);
	const mode = useAppSelector((state) => state.types.config.mode);

	const currentTypology = state ?? loadedTypology;

	useEffect(() => {
		if (!state && code) {
			dispatch(getTypologyByCode(code));
		}
		return () => {
			dispatch(getTypologyReset());
		};
	}, [dispatch, state, code]);

	useEffect(() => {
		if (mode !== 'edit') {
			dispatch(setTypeMode('edit'));
		}
	}, [mode, dispatch]);

	const listPath = `${PATHS.admin_types_base}/${config.pathSegment}`;

	if (!code) {
		return <Navigate to={listPath} />;
	}

	const handleSubmit = (value: TypologyDTO) => {
		dispatch(updateTypology(value));
	};

	return (
		<div className="editTypology">
			<h3 data-cy="sub-activity-title" className="title">
				{t('common.edit')} - {t(config.translationKey)}
			</h3>
			<TypologyForm
				creationMode={false}
				onSubmit={handleSubmit}
				isLoading={!!update.isLoading}
				resetButtonLabel={t('common.reset')}
				submitButtonLabel={t('common.save')}
				fields={getInitialFields(currentTypology)}
				family={config.family}
				onSuccessPath={listPath}
			/>
		</div>
	);
};

export default EditTypology;
