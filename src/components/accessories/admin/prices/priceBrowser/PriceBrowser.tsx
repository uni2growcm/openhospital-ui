import { Checkbox, CircularProgress, Tab, Tabs } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { AdminActivityContent } from '~/components/activities/adminActivity';
import { resolveApiErrorMessage } from '~/libraries/apiUtils/resolveApiErrorMessage';
import { useAppDispatch, useAppSelector } from '~/libraries/hooks/redux';
import checkIcon from '../../../../../assets/check-icon.png';
import { PATHS } from '../../../../../consts';
import type { PriceDTO } from '../../../../../generated';
import { getExams } from '../../../../../state/exams';
import { getMedicals } from '../../../../../state/medicals';
import { getOperations } from '../../../../../state/operations';
import {
	getPriceLists,
	getPrices,
	getPricesOthers,
	updatePrices,
	updatePricesReset,
} from '../../../../../state/prices';
import Button from '../../../button/Button';
import ConfirmationDialog from '../../../confirmationDialog/ConfirmationDialog';
import InfoBox from '../../../infoBox/InfoBox';
import SelectField from '../../../selectField/SelectField';
import type { TFilterField } from '../../../table/filter/types';
import Table from '../../../table/Table';
import classes from './PriceBrowser.module.scss';
import './styles.scss';
import type { IPriceItem, IPriceRowValue } from './types';

const CATEGORIES = ['EXA', 'OPE', 'MED', 'OTH'] as const;
type Category = (typeof CATEGORIES)[number];
type PriceTab = 'all' | Category;

const CATEGORY_LABEL_KEY: Record<Category, string> = {
	EXA: 'exams',
	OPE: 'operations',
	MED: 'medicals',
	OTH: 'others',
};

const makeRowKey = (group: string, item: string) => `${group}:${item}`;

export const PriceBrowser = () => {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const { t } = useTranslation();

	const { data: priceLists, status: priceListsStatus } = useAppSelector(
		(state) => state.prices.getPriceLists,
	);
	const { data: prices } = useAppSelector((state) => state.prices.getPrices);
	const { data: exams } = useAppSelector((state) => state.exams.examList);
	const { data: operations } = useAppSelector(
		(state) => state.operations.operationList,
	);
	const { data: medicals } = useAppSelector(
		(state) => state.medicals.medicalsOrderByName,
	);
	const { data: othersPrices } = useAppSelector(
		(state) => state.prices.getPricesOthers,
	);
	const updatePricesState = useAppSelector(
		(state) => state.prices.updatePrices,
	);

	const [selectedListId, setSelectedListId] = useState('');
	const [currentTab, setCurrentTab] = useState<PriceTab>('all');
	const [values, setValues] = useState<Record<string, IPriceRowValue>>({});

	useEffect(() => {
		dispatch(getPriceLists());
		dispatch(getPrices());
		dispatch(getExams());
		dispatch(getOperations());
		dispatch(getMedicals());
		dispatch(getPricesOthers());

		return () => {
			dispatch(updatePricesReset());
		};
	}, [dispatch]);

	useEffect(() => {
		if (!selectedListId && priceLists && priceLists.length > 0) {
			setSelectedListId(`${priceLists[0].id}`);
		}
	}, [priceLists, selectedListId]);

	const itemsByCategory: Record<Category, IPriceItem[]> = useMemo(
		() => ({
			EXA: (exams ?? []).map((exam) => ({
				item: exam.code ?? '',
				description: exam.description ?? '',
				editable: true,
			})),
			OPE: (operations ?? []).map((operation) => ({
				item: operation.code,
				description: operation.description,
				editable: true,
			})),
			MED: (medicals ?? []).map((medical) => ({
				item: `${medical.code ?? ''}`,
				description: medical.description ?? '',
				editable: true,
			})),
			OTH: (othersPrices ?? []).map((other) => ({
				item: `${other.id ?? ''}`,
				description: other.description,
				editable: !other.undefined,
			})),
		}),
		[exams, operations, medicals, othersPrices],
	);

	useEffect(() => {
		if (!selectedListId) {
			return;
		}
		const listId = Number.parseInt(selectedListId, 10);
		const priceByKey = new Map<string, PriceDTO>();
		(prices ?? [])
			.filter((price) => price.list?.id === listId)
			.forEach((price) => {
				priceByKey.set(makeRowKey(price.group, price.item), price);
			});

		const nextValues: Record<string, IPriceRowValue> = {};
		for (const category of CATEGORIES) {
			for (const item of itemsByCategory[category]) {
				const key = makeRowKey(category, item.item);
				const existing = priceByKey.get(key);
				nextValues[key] = {
					price: existing?.price ?? 0,
					variable: existing?.variable ?? false,
				};
			}
		}
		setValues(nextValues);
	}, [selectedListId, prices, itemsByCategory]);

	const handlePriceChange = (group: Category, item: string, price: number) => {
		const key = makeRowKey(group, item);
		const safePrice = Number.isNaN(price) ? 0 : Math.max(0, price);
		setValues((previous) => ({
			...previous,
			[key]: { price: safePrice, variable: previous[key]?.variable ?? false },
		}));
	};

	const handleVariableChange = (
		group: Category,
		item: string,
		variable: boolean,
	) => {
		const key = makeRowKey(group, item);
		setValues((previous) => ({
			...previous,
			[key]: { price: previous[key]?.price ?? 0, variable },
		}));
	};

	const rowsForCategory = (category: Category) =>
		itemsByCategory[category].map((itemEntry) => {
			const key = makeRowKey(category, itemEntry.item);
			const value = values[key] ?? { price: 0, variable: false };
			return {
				code: key,
				item: itemEntry.description,
				category: t(`pricelist.${CATEGORY_LABEL_KEY[category]}`),
				price: (
					<input
						type="number"
						min="0"
						step="0.01"
						className="priceBrowser__priceInput"
						value={value.price}
						disabled={!itemEntry.editable}
						onChange={(e) =>
							handlePriceChange(
								category,
								itemEntry.item,
								Number(e.target.value),
							)
						}
					/>
				),
				variable: (
					<Checkbox
						size="small"
						checked={value.variable}
						disabled={!itemEntry.editable}
						onChange={(e) =>
							handleVariableChange(category, itemEntry.item, e.target.checked)
						}
					/>
				),
			};
		});

	const rowsForTab = (tab: PriceTab) =>
		tab === 'all'
			? CATEGORIES.flatMap((category) => rowsForCategory(category))
			: rowsForCategory(tab);

	const selectedList = (priceLists ?? []).find(
		(list) => `${list.id}` === selectedListId,
	);

	const handleSave = () => {
		if (!selectedList) {
			return;
		}
		const priceDTO: PriceDTO[] = CATEGORIES.flatMap((category) =>
			itemsByCategory[category].map((item) => {
				const value = values[makeRowKey(category, item.item)] ?? {
					price: 0,
					variable: false,
				};
				return {
					list: selectedList,
					group: category,
					item: item.item,
					description: item.description,
					price: value.price,
					variable: value.variable,
				};
			}),
		);
		dispatch(updatePrices({ id: selectedList.id ?? 0, priceDTO }));
	};

	const header = (tab: PriceTab) => [
		'item',
		...(tab === 'all' ? ['category'] : []),
		'price',
		'variable',
	];

	const label = {
		item: t('pricelist.itemname'),
		category: t('pricelist.category'),
		price: t('pricelist.priceCol'),
		variable: t('pricelist.variable'),
	};

	const filters: TFilterField[] = [
		{ key: 'item', label: t('pricelist.itemname'), type: 'text' },
		...(currentTab === 'all'
			? [
					{
						key: 'category',
						label: t('pricelist.category'),
						type: 'select' as const,
						options: CATEGORIES.map((category) => {
							const categoryLabel = t(
								`pricelist.${CATEGORY_LABEL_KEY[category]}`,
							);
							return { label: categoryLabel, value: categoryLabel };
						}),
					},
				]
			: []),
	];

	return (
		<AdminActivityContent title={t('pricelist.pricebrowser')}>
			<div className={classes.priceBrowser} data-cy="price-browser">
				<div className={classes.header}>
					<Button
						type="button"
						variant="text"
						onClick={() => navigate(PATHS.admin_price_lists)}
						dataCy="manage-lists"
					>
						{t('pricelist.managelists')}
					</Button>
				</div>

				{priceListsStatus === 'LOADING' && (
					<CircularProgress
						style={{ marginLeft: '50%', position: 'relative' }}
					/>
				)}

				{priceListsStatus === 'SUCCESS_EMPTY' && (
					<InfoBox
						type="info"
						message={t('pricelist.pleasecreatealistfirst')}
					/>
				)}

				{priceListsStatus === 'SUCCESS' && (
					<>
						<div className={classes.selectRow}>
							<SelectField
								fieldName="priceList"
								fieldValue={selectedListId}
								label={t('pricelist.pricebrowser')}
								isValid={false}
								errorText=""
								onBlur={() => ({})}
								onChange={(value) => setSelectedListId(value)}
								options={(priceLists ?? []).map((list) => ({
									value: `${list.id}`,
									label: `${list.name} (${list.currency})`,
								}))}
							/>
						</div>

						<Tabs
							value={currentTab}
							onChange={(_event, newValue) => setCurrentTab(newValue)}
							aria-label="price-categories"
							variant="scrollable"
							scrollButtons="auto"
						>
							<Tab label={t('pricelist.all')} value="all" />
							{CATEGORIES.map((category) => (
								<Tab
									key={category}
									label={t(`pricelist.${CATEGORY_LABEL_KEY[category]}`)}
									value={category}
								/>
							))}
						</Tabs>

						<div className={classes.categories}>
							<Table
								key={currentTab}
								rowData={rowsForTab(currentTab)}
								tableHeader={header(currentTab)}
								labelData={label}
								columnsOrder={[
									'item',
									...(currentTab === 'all' ? ['category'] : []),
								]}
								rowsPerPage={15}
								showEmptyCell={false}
								filterColumns={filters}
								manualFilter={false}
								rowKey="code"
							/>
						</div>

						{updatePricesState.status === 'FAIL' && (
							<InfoBox
								type="error"
								message={resolveApiErrorMessage(updatePricesState.error, t)}
							/>
						)}

						<div className={classes.actions}>
							<Button
								type="button"
								variant="contained"
								disabled={!!updatePricesState.isLoading}
								onClick={handleSave}
								dataCy="save-prices"
							>
								{t('pricelist.save')}
							</Button>
						</div>
					</>
				)}

				<ConfirmationDialog
					isOpen={!!updatePricesState.hasSucceeded}
					title={t('pricelist.saved')}
					icon={checkIcon}
					info={t('pricelist.saveSuccess')}
					primaryButtonLabel="Ok"
					handlePrimaryButtonClick={() => {
						dispatch(updatePricesReset());
						dispatch(getPrices());
					}}
					handleSecondaryButtonClick={() => ({})}
				/>
			</div>
		</AdminActivityContent>
	);
};
