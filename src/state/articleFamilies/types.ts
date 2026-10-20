import type { ArticleFamilyDTO } from '../../generated';
import type { ApiResponse } from '../types';

export type IArticleFamilyState = {
	articleFamilyList: ApiResponse<Array<ArticleFamilyDTO>>;
	create: ApiResponse<ArticleFamilyDTO>;
	update: ApiResponse<ArticleFamilyDTO>;
	delete: ApiResponse<void>;
};
