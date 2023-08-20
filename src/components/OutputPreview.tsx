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

export const OutputPreview = ({ columnQueries, filteredJson }: Props) => {
	const [format, setFormat] = useState<OutputFormat>(OutputFormat.CSV);
	const [, copy] = useCopyToClipboard();
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

	return (
		<section className="flex flex-col min-w-0">
			<p className="font-bold mb-2">Output Preview</p>
			<div className="bg-white border flex rounded mb-4 p-3">
				<div>
					<label className="inline-block font-bold mr-3" htmlFor="format">
						Format
					</label>
					<select
						id="format"
						className="w-auto"
						value={format}
						onChange={handleFormatOnChange}
					>
						{Object.values(OutputFormat).map((format) => (
							<option key={format}>{format}</option>
						))}
					</select>
				</div>
				<div className="ml-auto">
					<button className="border py-1 px-2" onClick={handleCopyEvent}>
						Copy as {format.toUpperCase()}
					</button>
				</div>
			</div>
			<div className="bg-white grow p-3 rounded overflow-hidden h-0">
				<div className="max-h-full h-full overflow-auto">
					{[OutputFormat.CSV, OutputFormat.TSV].includes(format) && (
						<TransformDelimiterSeparatedValues
							delimiter={format === OutputFormat.CSV ? ',' : '\t'}
							transformManifest={columnQueries}
							filteredJson={filteredJson}
							onTransformerMount={handleTransformerMount}
						/>
					)}
				</div>
			</div>
		</section>
	);
};
