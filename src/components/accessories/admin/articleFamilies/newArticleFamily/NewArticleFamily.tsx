import { useTranslation } from 'react-i18next';
import { AdminActivityContent } from '~/components/activities/adminActivity';
import { useAppDispatch, useAppSelector } from '~/libraries/hooks/redux';
import type { ArticleFamilyDTO } from '../../../../../generated';
import { createArticleFamily } from '../../../../../state/articleFamilies';
import ArticleFamilyForm from '../articleFamilyForm/ArticleFamilyForm';
import { getInitialFields } from '../articleFamilyForm/consts';

export const NewArticleFamily = () => {
	const dispatch = useAppDispatch();
	const { t } = useTranslation();
	const create = useAppSelector((state) => state.articleFamilies.create);

	const handleSubmit = (value: ArticleFamilyDTO) => {
		dispatch(createArticleFamily(value));
	};

	return (
		<AdminActivityContent title={t('articleFamily.addNewArticleFamily')}>
			<ArticleFamilyForm
				creationMode
				onSubmit={handleSubmit}
				isLoading={!!create.isLoading}
				resetButtonLabel={t('common.reset')}
				submitButtonLabel={t('articleFamily.saveArticleFamily')}
				fields={getInitialFields(undefined)}
			/>
		</AdminActivityContent>
	);
};

export default NewArticleFamily;
