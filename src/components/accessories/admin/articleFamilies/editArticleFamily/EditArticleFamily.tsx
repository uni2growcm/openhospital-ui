import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate, useParams } from 'react-router';
import { AdminActivityContent } from '~/components/activities/adminActivity';
import { useAppDispatch, useAppSelector } from '~/libraries/hooks/redux';
import { PATHS } from '../../../../../consts';
import type { ArticleFamilyDTO } from '../../../../../generated';
import { updateArticleFamily } from '../../../../../state/articleFamilies';
import ArticleFamilyForm from '../articleFamilyForm/ArticleFamilyForm';
import { getInitialFields } from '../articleFamilyForm/consts';

export const EditArticleFamily = () => {
	const dispatch = useAppDispatch();
	const { t } = useTranslation();
	const { state }: { state: ArticleFamilyDTO | undefined } = useLocation();
	const { id } = useParams();
	const update = useAppSelector((state) => state.articleFamilies.update);
	const navigate = useNavigate();

	const handleSubmit = (value: ArticleFamilyDTO) => {
		if (value.id) {
			dispatch(updateArticleFamily({ id: value.id, articleFamilyDTO: value }));
		}
	};

	useEffect(() => {
		if (state?.id !== Number(id)) {
			navigate(PATHS.admin_article_families);
		}
	}, [id, navigate, state]);

	return (
		<AdminActivityContent title={t('articleFamily.editArticleFamily')}>
			<ArticleFamilyForm
				creationMode={false}
				onSubmit={handleSubmit}
				isLoading={!!update.isLoading}
				resetButtonLabel={t('common.reset')}
				submitButtonLabel={t('articleFamily.updateArticleFamily')}
				fields={getInitialFields(state)}
			/>
		</AdminActivityContent>
	);
};

export default EditArticleFamily;
