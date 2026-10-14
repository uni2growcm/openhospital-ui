import { type FC, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '~/libraries/hooks/redux';
import { PATHS } from '../../../../../../../consts';
import type { TypologyDTO } from '../../../../../../../generated';
import { setTypeMode } from '../../../../../../../state/types/config';
import { createTypology } from '../../../../../../../state/types/typologies';
import type { TypologyFamilyConfig } from '../typologyConfig';
import { getInitialFields } from '../typologyForm/consts';
import TypologyForm from '../typologyForm/TypologyForm';
import './styles.scss';

interface INewTypologyProps {
	config: TypologyFamilyConfig;
}

export const NewTypology: FC<INewTypologyProps> = ({ config }) => {
	const dispatch = useAppDispatch();
	const { t } = useTranslation();
	const create = useAppSelector((state) => state.types.typologies.create);

	useEffect(() => {
		dispatch(setTypeMode('edit'));
	}, [dispatch]);

	const handleSubmit = (value: TypologyDTO) => {
		dispatch(createTypology(value));
	};

	const listPath = `${PATHS.admin_types_base}/${config.pathSegment}`;

	return (
		<div className="newTypology">
			<h3 data-cy="sub-activity-title" className="title">
				{t('common.add')} - {t(config.translationKey)}
			</h3>
			<TypologyForm
				creationMode
				onSubmit={handleSubmit}
				isLoading={!!create.isLoading}
				resetButtonLabel={t('common.reset')}
				submitButtonLabel={t('common.save')}
				fields={getInitialFields(undefined)}
				family={config.family}
				onSuccessPath={listPath}
				typeName={t(config.translationKey)}
			/>
		</div>
	);
};

export default NewTypology;
