import type { CountryDTO } from '../../../generated';

export interface IProps {
	isOpen: boolean;
	onClose: () => void;
	onCreated: (country: CountryDTO) => void;
}
