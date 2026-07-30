import { Visibility } from '@mui/icons-material';
import { IconButton, Tooltip } from '@mui/material';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import type { InstanceResponse } from '~/generated';
import './styles.scss';
import Table from '~/components/accessories/table/Table';

interface IOwnProps {
	data: InstanceResponse[];
	onPreview: (row: any) => () => void;
	seriesDescription?: string;
}

export const Instances = ({ data, onPreview, seriesDescription }: IOwnProps) => {
	const { t, i18n } = useTranslation();

	const header = ['title', 'date', 'time'];

	const label = {
		title: t('radiology.instances.title'),
		date: t('radiology.instances.date'),
		time: t('radiology.instances.time'),
	};

	const order = ['title', 'date', 'time'];

	const formatDataToDisplay = (data: InstanceResponse[]) => {
		return data.map((instance) => {
			return {
				id: instance.id ?? '',
				title: seriesDescription
					? seriesDescription
					: t('radiology.instances.title', {
							number: instance.instance?.instanceNumber ?? '',
					  }),
				date: instance.instance?.creationDate
					? moment(instance.instance.creationDate, 'YYYYMMDD')
							.locale(i18n.language)
							.format('L')
					: '',
				time: instance.instance?.creationTime
					? moment(instance.instance?.creationTime, 'HHmmss')
							.locale(i18n.language)
							.format('LTS')
					: '',
				fileUid: instance.fileUuid ?? '',
			};
		});
	};

	return (
		<div className="instances">
			<Table
				columnsOrder={order}
				rowData={formatDataToDisplay(data)}
				tableHeader={header}
				labelData={label}
				rowsPerPage={data.length}
				isCollapsabile={false}
				renderCustomActions={(row) => (
					<div className="instances__actions">
						<Tooltip title={t('radiology.instances.preview')}>
							<IconButton onClick={onPreview(row)}>
								<Visibility />
							</IconButton>
						</Tooltip>
					</div>
				)}
				hideHeader={true}
				hidePaginator={true}
			/>
		</div>
	);
};
