import { Navigate, type RouteObject } from 'react-router';
import {
  ChargeMovement,
  Home,
  NotFound,
  PharmacyStock,
  WardStock,
} from '~/components/activities/pharmacyActivity';
import MedicalDetails from '~/components/activities/pharmacyActivity/pharmaceutical/components/medicalDetails/MedicalDetails';
import { NewPharmaceutical } from '~/components/activities/pharmacyActivity/pharmaceutical/NewPharmaceutical';
import Pharmaceutical from '~/components/activities/pharmacyActivity/pharmaceutical/Pharmaceutical';
import { UpdatePharmaceutical } from '~/components/activities/pharmacyActivity/pharmaceutical/UpdatePharmaceutical';
import { DischargeMovement } from '~/components/activities/pharmacyActivity/pharmaceuticalStock/DischargeMovement';
import { WardDischargeMovement } from '~/components/activities/pharmacyActivity/wardStock/DischargeMovement';
import WardStockRectify from '~/components/activities/pharmacyActivity/wardStock/WardStockRectify';
import { PATHS } from '../../consts';

const getPath = (from: string) => from.replace(`${PATHS.pharmacy}/`, '');

export const PHARMACY_ROUTES: RouteObject[] = [
	{
		path: '',
		element: <Navigate to="home" replace />,
	},
	{
		path: 'home',
		element: <Home />,
	},
	{
		path: getPath(PATHS.pharmacy_ward_stock),
		element: <WardStock />,
	},
	{
		path: getPath(PATHS.pharmacy_pharmaceutical),
		element: <Pharmaceutical />,
	},
	{
		path: getPath(PATHS.pharmacy_pharmaceuticalstock),
		element: <PharmacyStock />,
	},
	{
		path: getPath(PATHS.pharmacy_pharmaceuticalstock_charge),
		element: <ChargeMovement />,
	},
	{
		path: getPath(PATHS.pharmacy_pharmaceuticalstock_discharge),
		element: <DischargeMovement />,
	},
	{
		path: getPath(PATHS.pharmacy_pharmaceutical_new),
		element: <NewPharmaceutical />,
	},
	{
		path: getPath(PATHS.pharmacy_pharmaceutical_update),
		element: <UpdatePharmaceutical />,
	},
	{
		path: getPath(PATHS.pharmacy_pharmaceutical_detail),
		element: <MedicalDetails />,
	},
	{
		path: getPath(PATHS.pharmacy_ward_stock_rectify),
		element: <WardStockRectify />,
	},
	{
		path: getPath(PATHS.pharmacy_ward_stock_discharge),
		element: <WardDischargeMovement />,
	},
	{
		path: '*',
		element: <NotFound />,
	},
];
