import { Navigate, type RouteObject } from 'react-router';
import AdminActivity from '../../components/activities/adminActivity';
import { PATHS } from '../../consts';
import { TYPES_ROUTES } from './types';

const getPath = (from: string) => from.replace(`${PATHS.admin}/`, '');

export const ADMIN_ROUTES: RouteObject[] = [
	{
		path: '',
		element: <Navigate to="wards" replace />,
	},
	{
		path: 'wards',
		lazy: async () =>
			import('../../components/accessories/admin/wards').then((module) => ({
				Component: module.Wards,
			})),
	},
	{
		path: getPath(PATHS.admin_wards_new),
		lazy: async () =>
			import('../../components/accessories/admin/wards').then((module) => ({
				Component: module.NewWard,
			})),
	},
	{
		path: getPath(PATHS.admin_wards_edit),
		lazy: async () =>
			import('../../components/accessories/admin/wards').then((module) => ({
				Component: module.EditWard,
			})),
	},
	{
		path: getPath(PATHS.admin_staff),
		lazy: async () =>
			import('../../components/accessories/admin/staff').then((module) => ({
				Component: module.Staff,
			})),
	},
	{
		path: getPath(PATHS.admin_staff_new),
		lazy: async () =>
			import('../../components/accessories/admin/staff').then((module) => ({
				Component: module.NewStaff,
			})),
	},
	{
		path: getPath(PATHS.admin_staff_edit),
		lazy: async () =>
			import('../../components/accessories/admin/staff').then((module) => ({
				Component: module.EditStaff,
			})),
	},
	{
		path: getPath(PATHS.admin_diseases),
		lazy: async () =>
			import('../../components/accessories/admin/diseases').then((module) => ({
				Component: module.Diseases,
			})),
	},
	{
		path: getPath(PATHS.admin_diseases_new),
		lazy: async () =>
			import('../../components/accessories/admin/diseases').then((module) => ({
				Component: module.NewDisease,
			})),
	},
	{
		path: getPath(PATHS.admin_diseases_edit),
		lazy: async () =>
			import('../../components/accessories/admin/diseases').then((module) => ({
				Component: module.EditDisease,
			})),
	},
	{
		path: getPath(PATHS.admin_exams),
		lazy: async () =>
			import('../../components/accessories/admin/exams').then((module) => ({
				Component: module.Exams,
			})),
	},
	{
		path: getPath(PATHS.admin_exams_new),
		lazy: async () =>
			import('../../components/accessories/admin/exams').then((module) => ({
				Component: module.NewExam,
			})),
	},
	{
		path: getPath(PATHS.admin_exams_edit),
		lazy: async () =>
			import('../../components/accessories/admin/exams').then((module) => ({
				Component: module.EditExam,
			})),
	},
	{
		path: getPath(PATHS.admin_operations),
		lazy: async () =>
			import('../../components/accessories/admin/operations').then(
				(module) => ({
					Component: module.Operations,
				}),
			),
	},
	{
		path: getPath(PATHS.admin_operations_new),
		lazy: async () =>
			import('../../components/accessories/admin/operations').then(
				(module) => ({
					Component: module.NewOperation,
				}),
			),
	},
	{
		path: getPath(PATHS.admin_operations_edit),
		lazy: async () =>
			import('../../components/accessories/admin/operations').then(
				(module) => ({
					Component: module.EditOperation,
				}),
			),
	},
	{
		path: getPath(PATHS.admin_vaccines),
		lazy: async () =>
			import('../../components/accessories/admin/vaccines').then((module) => ({
				Component: module.Vaccines,
			})),
	},
	{
		path: getPath(PATHS.admin_vaccines_new),
		lazy: async () =>
			import('../../components/accessories/admin/vaccines').then((module) => ({
				Component: module.NewVaccine,
			})),
	},
	{
		path: getPath(PATHS.admin_vaccines_edit),
		lazy: async () =>
			import('../../components/accessories/admin/vaccines').then((module) => ({
				Component: module.EditVaccine,
			})),
	},
	{
		path: getPath(PATHS.admin_prices),
		lazy: async () =>
			import('../../components/accessories/admin/prices').then((module) => ({
				Component: module.PriceBrowser,
			})),
	},
	{
		path: getPath(PATHS.admin_price_lists),
		lazy: async () =>
			import('../../components/accessories/admin/prices').then((module) => ({
				Component: module.Prices,
			})),
	},
	{
		path: getPath(PATHS.admin_price_lists_new),
		lazy: async () =>
			import('../../components/accessories/admin/prices').then((module) => ({
				Component: module.NewPriceList,
			})),
	},
	{
		path: getPath(PATHS.admin_price_lists_edit),
		lazy: async () =>
			import('../../components/accessories/admin/prices').then((module) => ({
				Component: module.EditPriceList,
			})),
	},
	{
		path: getPath(PATHS.admin_suppliers),
		lazy: async () =>
			import('../../components/accessories/admin/suppliers').then((module) => ({
				Component: module.Suppliers,
			})),
	},
	{
		path: getPath(PATHS.admin_suppliers_new),
		lazy: async () =>
			import('../../components/accessories/admin/suppliers').then((module) => ({
				Component: module.NewSupplier,
			})),
	},
	{
		path: getPath(PATHS.admin_suppliers_edit),
		lazy: async () =>
			import('../../components/accessories/admin/suppliers').then((module) => ({
				Component: module.EditSupplier,
			})),
	},
	{
		path: getPath(PATHS.admin_users),
		lazy: async () =>
			import('../../components/accessories/admin/users').then((module) => ({
				Component: module.Users,
			})),
	},
	{
		path: getPath(PATHS.admin_users_new),
		lazy: async () =>
			import('../../components/accessories/admin/users').then((module) => ({
				Component: module.NewUser,
			})),
	},
	{
		path: getPath(PATHS.admin_usergroups_new),
		lazy: async () =>
			import('../../components/accessories/admin/users').then((module) => ({
				Component: module.NewGroup,
			})),
	},
	{
		path: getPath(PATHS.admin_usergroups_edit),
		lazy: async () =>
			import('../../components/accessories/admin/users').then((module) => ({
				Component: module.EditGroup,
			})),
	},
	{
		path: getPath(PATHS.admin_users_edit),
		lazy: async () =>
			import('../../components/accessories/admin/users').then((module) => ({
				Component: module.EditUser,
			})),
	},
	{
		path: getPath(PATHS.admin_settings),
		lazy: async () =>
			import('../../components/accessories/admin/settings').then((module) => ({
				Component: module.Settings,
			})),
	},
	{
		path: getPath(PATHS.admin_reductionplans),
		lazy: async () =>
			import('../../components/accessories/admin/reductionPlans').then(
				(module) => ({
					Component: module.ReductionPlans,
				}),
			),
	},
	{
		path: getPath(PATHS.admin_reductionplans_new),
		lazy: async () =>
			import('../../components/accessories/admin/reductionPlans').then(
				(module) => ({
					Component: module.NewReductionPlan,
				}),
			),
	},
	{
		path: getPath(PATHS.admin_reductionplans_edit),
		lazy: async () =>
			import('../../components/accessories/admin/reductionPlans').then(
				(module) => ({
					Component: module.EditReductionPlan,
				}),
			),
	},
	{
		path: getPath(PATHS.admin_types),
		lazy: async () =>
			import('./types').then((module) => ({
				Component: module.TypesAdmin,
			})),
		children: TYPES_ROUTES,
	},
	{
		path: getPath(PATHS.admin_hospital_edit),
		lazy: async () =>
			import('../../components/accessories/admin/hospital').then((module) => ({
				Component: module.EditHospital,
			})),
	},
	{
		path: 'admin/*',
		lazy: async () =>
			import('../../components/activities/notFound/NotFound').then(
				(module) => ({
					Component: module.NotFound,
				}),
			),
	},
];

export { AdminActivity };
