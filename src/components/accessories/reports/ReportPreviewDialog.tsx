import { Close, Download } from '@mui/icons-material';
import {
	Box,
	Dialog,
	DialogContent,
	DialogTitle,
	IconButton,
	Tooltip,
} from '@mui/material';
import { type FC, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { downloadBlob } from '~/libraries/downloadUtils/downloadUtils';
import './styles.scss';

type IOwnProps = {
	title: string;
	blob?: Blob;
	fileName: string;
	onClose: () => void;
};

export const ReportPreviewDialog: FC<IOwnProps> = ({
	title,
	blob,
	fileName,
	onClose,
}) => {
	const { t } = useTranslation();

	const url = useMemo(
		() =>
			blob
				? URL.createObjectURL(new Blob([blob], { type: 'application/pdf' }))
				: undefined,
		[blob],
	);

	useEffect(
		() => () => {
			if (url) URL.revokeObjectURL(url);
		},
		[url],
	);

	return (
		<Dialog
			open={!!blob}
			onClose={onClose}
			fullWidth
			maxWidth="lg"
			data-cy="report-preview-dialog"
		>
			<DialogTitle>
				<Box display="flex" alignItems="center">
					<Box flexGrow={1}>
						<strong>{title}</strong>
					</Box>
					<Tooltip title={t('reports.actions.download')}>
						<IconButton
							data-cy="report-preview-download"
							onClick={() => blob && downloadBlob(blob, fileName)}
						>
							<Download />
						</IconButton>
					</Tooltip>
					<IconButton data-cy="report-preview-close" onClick={onClose}>
						<Close />
					</IconButton>
				</Box>
			</DialogTitle>
			<DialogContent dividers className="reportPreview">
				{url && (
					<iframe
						className="reportPreview__frame"
						src={url}
						title={title}
						data-cy="report-preview-frame"
					/>
				)}
			</DialogContent>
		</Dialog>
	);
};
