import { type FC, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { useAppDispatch } from '~/libraries/hooks/redux';
import { PATHS } from '../../../../../../consts';
import type { TypologyDTO } from '../../../../../../generated';
import { setTypeMode } from '../../../../../../state/types/config';
import {
	deleteTypology,
	deleteTypologyReset,
	getTypologies,
} from '../../../../../../state/types/typologies';
import Button from '../../../../button/Button';
import './styles.scss';
import TypologiesTable from './typologiesTable';
import type { TypologyFamilyConfig } from './typologyConfig';

interface ITypologiesProps {
	config: TypologyFamilyConfig;
}

export const Typologies: FC<ITypologiesProps> = ({ config }) => {
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const { t } = useTranslation();

	useEffect(() => {
		dispatch(getTypologies(config.getFamilyParam));
		dispatch(setTypeMode('manage'));

		return () => {
			dispatch(deleteTypologyReset());
		};
	}, [dispatch, config.getFamilyParam]);

	const basePath = `${PATHS.admin_types_base}/${config.pathSegment}`;

	const handleEdit = (row: TypologyDTO) => {
		navigate(`${basePath}/${row.code}/edit`, {
			state: row,
		});
	};

	const handleDelete = (row: TypologyDTO) => {
		if (row.code) {
			dispatch(deleteTypology(row.code));
		}
	};

	return (
		<>
			<h3 data-cy="sub-activity-title">{t(config.translationKey)}</h3>

			<div className="typologies" data-cy="typologies-table">
				<TypologiesTable
					onEdit={handleEdit}
					onDelete={handleDelete}
					headerActions={
						<Button
							onClick={() => {
								navigate(`${basePath}/new`);
							}}
							type="button"
							variant="contained"
							color="primary"
							dataCy="add-typology"
						>
							{t('common.add')}
						</Button>
					}
				/>
			</div>
		</>
	);
};

export default Typologies;
