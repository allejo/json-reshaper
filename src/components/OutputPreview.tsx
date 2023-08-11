import { ChangeEvent, useCallback, useRef, useState } from 'react';

import {
	DataTransformerFxn,
	FilteredJson,
	TransformerMountFxn,
	TransformManifest,
} from '../contracts.ts';
import { TransformCSV } from './TransformCSV.tsx';

enum OutputFormat {
	CSV = 'csv',
}

interface Props {
	columnQueries: TransformManifest;
	filteredJson: FilteredJson;
}

export const OutputPreview = ({ columnQueries, filteredJson }: Props) => {
	const [format, setFormat] = useState<OutputFormat>(OutputFormat.CSV);
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

		navigator.clipboard
			.writeText(transformedText)
			.then(() => {
				console.log('Copied to clipboard');
			})
			.catch((err) => {
				console.error(err);
			});
	}, []);

	return (
		<section className="flex flex-col">
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
			<div className="bg-white grow p-3 rounded overflow-hidden">
				<div className="max-h-full h-full overflow-auto">
					{format === OutputFormat.CSV && (
						<TransformCSV
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
