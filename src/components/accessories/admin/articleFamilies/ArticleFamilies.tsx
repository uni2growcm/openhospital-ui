import { Search } from '@mui/icons-material';
import { InputAdornment, TextField } from '@mui/material';
import { type ChangeEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { AdminActivityContent } from '~/components/activities/adminActivity';
import { useAppDispatch } from '~/libraries/hooks/redux';
import {
	deleteArticleFamily,
	getArticleFamilies,
} from '~/state/articleFamilies';
import { PATHS } from '../../../../consts';
import type { ArticleFamilyDTO } from '../../../../generated';
import Button from '../../button/Button';
import classes from './ArticleFamilies.module.scss';
import ArticleFamiliesTable from './articleFamiliesTable';

export const ArticleFamilies = () => {
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const { t } = useTranslation();
	const [searchTerm, setSearchTerm] = useState('');

	useEffect(() => {
		const handler = setTimeout(() => {
			dispatch(
				getArticleFamilies(searchTerm.trim() ? searchTerm.trim() : undefined),
			);
		}, 300);

		return () => clearTimeout(handler);
	}, [dispatch, searchTerm]);

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
				<div className={classes.topBar}>
					<div className={classes.searchBox}>
						<TextField
							fullWidth
							size="small"
							variant="outlined"
							placeholder={t('articleFamily.searchPlaceholder', {
								defaultValue: 'Search article family...',
							})}
							value={searchTerm}
							onChange={(e: ChangeEvent<HTMLInputElement>) =>
								setSearchTerm(e.target.value)
							}
							InputProps={{
								startAdornment: (
									<InputAdornment position="start">
										<Search fontSize="small" />
									</InputAdornment>
								),
							}}
						/>
					</div>
					<div className={classes.headerActions}>
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
					</div>
				</div>
				<ArticleFamiliesTable onEdit={handleEdit} onDelete={handleDelete} />
			</div>
		</AdminActivityContent>
	);
};

export default ArticleFamilies;
