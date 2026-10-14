import { CircularProgress, TextField } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { AdminActivityContent } from '~/components/activities/adminActivity';
import { useAppDispatch, useAppSelector } from '~/libraries/hooks/redux';
import { PATHS } from '../../../../../consts';
import type { PriceDTO } from '../../../../../generated';
import { getExams } from '../../../../../state/exams';
import { getMedicals } from '../../../../../state/medicals';
import { getOperations } from '../../../../../state/operations';
import {
	getPriceLists,
	getPrices,
	updatePrices,
	updatePricesReset,
} from '../../../../../state/prices';
import { getPricesOthers } from '../../../../../state/pricesOthers';
import Button from '../../../button/Button';
import ConfirmationDialog from '../../../confirmationDialog/ConfirmationDialog';
import InfoBox from '../../../infoBox/InfoBox';
import SelectField from '../../../selectField/SelectField';
import checkIcon from '../../../../../assets/check-icon.png';
import classes from './PriceBrowser.module.scss';
import { PriceCategorySection } from './PriceCategorySection';
import type { IPriceItem, IPriceRowValue } from './types';

const CATEGORIES = ['EXA', 'OPE', 'MED', 'OTH'] as const;
type Category = (typeof CATEGORIES)[number];

const rowKey = (group: string, item: string) => `${group}:${item}`;

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
		(state) => state.pricesOthers.getPricesOthers,
	);
	const updatePricesState = useAppSelector(
		(state) => state.prices.updatePrices,
	);

	const [selectedListId, setSelectedListId] = useState('');
	const [search, setSearch] = useState('');
	const [values, setValues] = useState<Record<string, IPriceRowValue>>({});
	const [expanded, setExpanded] = useState<Record<Category, boolean>>({
		EXA: true,
		OPE: true,
		MED: true,
		OTH: true,
	});

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
				priceByKey.set(rowKey(price.group, price.item), price);
			});

		const nextValues: Record<string, IPriceRowValue> = {};
		for (const category of CATEGORIES) {
			for (const item of itemsByCategory[category]) {
				const key = rowKey(category, item.item);
				const existing = priceByKey.get(key);
				nextValues[key] = {
					price: existing?.price ?? 0,
					variable: existing?.variable ?? false,
				};
			}
		}
		setValues(nextValues);
	}, [selectedListId, prices, itemsByCategory]);

	const filterItems = (items: IPriceItem[]) => {
		if (!search.trim()) {
			return items;
		}
		const term = search.trim().toLowerCase();
		return items.filter((item) =>
			item.description.toLowerCase().includes(term),
		);
	};

	const handlePriceChange = (group: Category, item: string, price: number) => {
		const key = rowKey(group, item);
		setValues((previous) => ({
			...previous,
			[key]: { price, variable: previous[key]?.variable ?? false },
		}));
	};

	const handleVariableChange = (
		group: Category,
		item: string,
		variable: boolean,
	) => {
		const key = rowKey(group, item);
		setValues((previous) => ({
			...previous,
			[key]: { price: previous[key]?.price ?? 0, variable },
		}));
	};

	const valuesForCategory = (category: Category) => {
		const result: Record<string, IPriceRowValue> = {};
		for (const item of itemsByCategory[category]) {
			result[item.item] = values[rowKey(category, item.item)] ?? {
				price: 0,
				variable: false,
			};
		}
		return result;
	};

	const selectedList = (priceLists ?? []).find(
		(list) => `${list.id}` === selectedListId,
	);

	const handleSave = () => {
		if (!selectedList) {
			return;
		}
		const priceDTO: PriceDTO[] = CATEGORIES.flatMap((category) =>
			itemsByCategory[category].map((item) => {
				const value = values[rowKey(category, item.item)] ?? {
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
							<TextField
								className={classes.search}
								size="small"
								label={t('pricelist.search')}
								value={search}
								onChange={(e) => setSearch(e.target.value)}
							/>
						</div>

						<div className={classes.categories}>
							<PriceCategorySection
								title={t('pricelist.exams')}
								items={filterItems(itemsByCategory.EXA)}
								values={valuesForCategory('EXA')}
								onPriceChange={(item, price) =>
									handlePriceChange('EXA', item, price)
								}
								onVariableChange={(item, variable) =>
									handleVariableChange('EXA', item, variable)
								}
								expanded={expanded.EXA}
								onToggle={() =>
									setExpanded((previous) => ({
										...previous,
										EXA: !previous.EXA,
									}))
								}
							/>
							<PriceCategorySection
								title={t('pricelist.operations')}
								items={filterItems(itemsByCategory.OPE)}
								values={valuesForCategory('OPE')}
								onPriceChange={(item, price) =>
									handlePriceChange('OPE', item, price)
								}
								onVariableChange={(item, variable) =>
									handleVariableChange('OPE', item, variable)
								}
								expanded={expanded.OPE}
								onToggle={() =>
									setExpanded((previous) => ({
										...previous,
										OPE: !previous.OPE,
									}))
								}
							/>
							<PriceCategorySection
								title={t('pricelist.medicals')}
								items={filterItems(itemsByCategory.MED)}
								values={valuesForCategory('MED')}
								onPriceChange={(item, price) =>
									handlePriceChange('MED', item, price)
								}
								onVariableChange={(item, variable) =>
									handleVariableChange('MED', item, variable)
								}
								expanded={expanded.MED}
								onToggle={() =>
									setExpanded((previous) => ({
										...previous,
										MED: !previous.MED,
									}))
								}
							/>
							<PriceCategorySection
								title={t('pricelist.others')}
								items={filterItems(itemsByCategory.OTH)}
								values={valuesForCategory('OTH')}
								onPriceChange={(item, price) =>
									handlePriceChange('OTH', item, price)
								}
								onVariableChange={(item, variable) =>
									handleVariableChange('OTH', item, variable)
								}
								expanded={expanded.OTH}
								onToggle={() =>
									setExpanded((previous) => ({
										...previous,
										OTH: !previous.OTH,
									}))
								}
							/>
						</div>

						{updatePricesState.status === 'FAIL' && (
							<InfoBox
								type="error"
								message={
									updatePricesState.error?.message ?? t('common.somethingwrong')
								}
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
