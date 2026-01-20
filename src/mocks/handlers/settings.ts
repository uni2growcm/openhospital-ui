import { HttpResponse } from 'msw';
import type { UserSettingDTO } from '~/generated';
import { http } from '../utils';

export const settings = [
	http.get('/usersettings', () => {
		return HttpResponse.json(
			[{ id: 1, configName: 'landing', configValue: '/', user: 'john' }],
			{ status: 200 },
		);
	}),

	http.get('/usersettings/{configName}', ({ params }) => {
		const setting =
			params.configName === 'dashboard'
				? {}
				: {
						id: 1,
						configName: 'layout',
						configValue: 'DxD',
						user: 'john',
					};

		return HttpResponse.json(setting as UserSettingDTO, { status: 200 });
	}),
];
