import { Checkbox } from '@mui/material';
import MaterialTable from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
} from '../../../accordion/Accordion';
import './styles.scss';
import type { IPriceCategorySectionProps } from './types';

export const PriceCategorySection: FC<IPriceCategorySectionProps> = ({
	title,
	items,
	values,
	onPriceChange,
	onVariableChange,
	expanded,
	onToggle,
}) => {
	const { t } = useTranslation();

	if (items.length === 0) {
		return null;
	}

	return (
		<Accordion expanded={expanded}>
			<AccordionSummary onClick={onToggle}>
				{title} ({items.length})
			</AccordionSummary>
			<AccordionDetails>
				<MaterialTable size="small">
					<TableHead>
						<TableRow>
							<TableCell>{t('pricelist.itemname')}</TableCell>
							<TableCell align="right">{t('pricelist.priceCol')}</TableCell>
							<TableCell align="center">{t('pricelist.variable')}</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{items.map((item) => {
							const value = values[item.item] ?? { price: 0, variable: false };
							return (
								<TableRow key={item.item}>
									<TableCell>{item.description}</TableCell>
									<TableCell align="right">
										<input
											type="number"
											className="priceBrowser__priceInput"
											value={value.price}
											disabled={!item.editable}
											onChange={(e) =>
												onPriceChange(item.item, Number(e.target.value))
											}
										/>
									</TableCell>
									<TableCell align="center">
										<Checkbox
											size="small"
											checked={value.variable}
											disabled={!item.editable}
											onChange={(e) =>
												onVariableChange(item.item, e.target.checked)
											}
										/>
									</TableCell>
								</TableRow>
							);
						})}
					</TableBody>
				</MaterialTable>
			</AccordionDetails>
		</Accordion>
	);
};
