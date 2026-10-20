import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { AdminActivityContent } from '~/components/activities/adminActivity';
import { useAppDispatch } from '~/libraries/hooks/redux';
import { deleteArticleFamily } from '~/state/articleFamilies';
import { PATHS } from '../../../../consts';
import type { ArticleFamilyDTO } from '../../../../generated';
import Button from '../../button/Button';
import classes from './ArticleFamilies.module.scss';
import ArticleFamiliesTable from './articleFamiliesTable';

export const ArticleFamilies = () => {
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const { t } = useTranslation();

	const handleEdit = (row: ArticleFamilyDTO) => {
		if (row?.id != null) {
			navigate(PATHS.admin_article_families_edit.replace(':id', `${row.id}`), {
				state: row,
			});
		}
	};

	const handleDelete = (row: ArticleFamilyDTO) => {
		if (row?.id != null) {
			dispatch(deleteArticleFamily(row.id));
		}
	};

	return (
		<AdminActivityContent title={t('nav.articleFamilies')}>
			<div className={classes.articleFamilies}>
				<ArticleFamiliesTable
					onEdit={handleEdit}
					onDelete={handleDelete}
					headerActions={
						<Button
							onClick={() => {
								navigate(PATHS.admin_article_families_new);
							}}
							type="button"
							variant="contained"
							color="primary"
						>
							{t('articleFamily.addArticleFamily')}
						</Button>
					}
				/>
			</div>
		</AdminActivityContent>
	);
};

export default ArticleFamilies;
