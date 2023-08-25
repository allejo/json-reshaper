import { ChangeEvent, useCallback, useRef, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useCopyToClipboard } from 'usehooks-ts';

import {
	DataTransformerFxn,
	FilteredJson,
	TransformerMountFxn,
	TransformManifest,
} from '../contracts.ts';
import { TransformDelimiterSeparatedValues } from './TransformDelimiterSeparatedValues.tsx';

enum OutputFormat {
	CSV = 'csv',
	TSV = 'tsv',
}

interface Props {
	columnQueries: TransformManifest;
	filteredJson: FilteredJson;
}
const MimeType: Record<OutputFormat, string> = {
	[OutputFormat.CSV]: 'text/csv',
	[OutputFormat.TSV]: 'text/tab-seprated-values',
};

export const OutputPreview = ({ columnQueries, filteredJson }: Props) => {
	const [format, setFormat] = useState<OutputFormat>(OutputFormat.CSV);
	const [, copy] = useCopyToClipboard();
	const [fileLink, setFileLink] = useState<string>('');
	const [showButtons, setShowButtons] = useState<boolean>(false);
	const getTransformedAsText = useRef<DataTransformerFxn>(() => {
		throw new Error('Transformer not mounted');
	});

	const handleFormatOnChange = useCallback(
		(e: ChangeEvent<HTMLSelectElement>) => {
			setFormat(e.currentTarget.value as OutputFormat);
		},
		[],
	);
	const handleTransformerMount = useCallback<TransformerMountFxn>(
		(transformer) => {
			getTransformedAsText.current = transformer;
		},
		[],
	);
	const handleCopyEvent = useCallback(() => {
		const transformedText = getTransformedAsText.current();

		copy(transformedText)
			.then(() => {
				toast.success('Copied to clipboard');
			})
			.catch((err: { message: string }) => {
				toast.error(err.message);
			});
	}, [copy]);

	const handleDownload = useCallback(() => {
		const transformedText = getTransformedAsText.current();
		const type = MimeType[format];
		const data = new Blob([transformedText], { type });
		const url = window.URL.createObjectURL(data);
		setFileLink(url);
	}, [format]);

	return (
		<section className="flex flex-col min-w-0">
			<p className="font-bold mb-2">Output Preview</p>
			<div className="bg-white border flex rounded mb-4 p-3">
				<div className="flex items-center">
					<label className="inline-block font-bold mr-3 my-0" htmlFor="format">
						Format
					</label>

					<select
						id="format"
						className="w-auto mb-0"
						value={format}
						onChange={handleFormatOnChange}
					>
						{Object.values(OutputFormat).map((format) => (
							<option key={format}>{format}</option>
						))}
					</select>
				</div>
				{showButtons && <div className="ml-auto flex gap-2">
					<button className="border py-1 px-2" onClick={handleCopyEvent}>
						Copy as {format.toUpperCase()}
					</button>
					<a
						download={`json-reshaper.${format}`}
						href={fileLink}
						className="border py-1 px-2"
						onClick={handleDownload}
					>
						Download {format.toUpperCase()}
					</a>
				</div>}
			</div>
			<div className="bg-white grow p-3 rounded overflow-hidden h-0">
				<div className="max-h-full h-full overflow-auto">
					{[OutputFormat.CSV, OutputFormat.TSV].includes(format) && (
						<TransformDelimiterSeparatedValues
							delimiter={format === OutputFormat.CSV ? ',' : '\t'}
							transformManifest={columnQueries}
							filteredJson={filteredJson}
							onTransformerMount={handleTransformerMount}
							setShowButtons = {setShowButtons}
						/>
					)}
				</div>
			</div>
		</section>
	);
};
