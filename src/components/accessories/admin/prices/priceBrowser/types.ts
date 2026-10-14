export interface IPriceRowValue {
	price: number;
	variable: boolean;
}

export interface IPriceItem {
	item: string;
	description: string;
	editable: boolean;
}

export interface IPriceCategorySectionProps {
	title: string;
	items: IPriceItem[];
	values: Record<string, IPriceRowValue>;
	onPriceChange: (item: string, price: number) => void;
	onVariableChange: (item: string, variable: boolean) => void;
	expanded: boolean;
	onToggle: () => void;
}
