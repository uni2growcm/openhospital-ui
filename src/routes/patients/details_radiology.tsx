import { Navigate } from 'react-router';
import { PermissionDenied } from '~/components/accessories/permissionDenied/PermissionDenied';
import { Radiology } from '~/components/accessories/radiology';
import PatientDetailsActivityContent from '~/components/activities/patientDetailsActivityContent/PatientDetailsActivityContent';
import { withPermission } from '~/libraries/permissionUtils/withPermission';

const RadiologyLayout = withPermission(
	'radiology.read',
	PermissionDenied,
)(() => (
	<PatientDetailsActivityContent title="Radiology">
		<Radiology />
	</PatientDetailsActivityContent>
));

export const PATIENT_RADIOLOGY_ROUTES = [
	{
		element: <RadiologyLayout />,
		children: [
			{ index: true, element: <Navigate to="studies" replace /> },

			{
				path: 'studies',
				lazy: async () =>
					import('../../components/accessories/radiology/studies/Studies').then(
						(mod) => ({
							Component: mod.Studies,
						}),
					),
			},
			{
				path: 'studies/:studyId/series',
				lazy: async () =>
					import('../../components/accessories/radiology/series/Series').then(
						(mod) => ({
							Component: mod.Series,
						}),
					),
			},
			{
				path: 'studies/:studyId/series/:serie_id/instances',
				element: <h1>Serie Instances</h1>,
			},
			{
				path: '*',
				element: <h1>Page not found !</h1>,
			},
		],
	},
];
