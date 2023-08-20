import { ChangeEvent, useCallback, useRef, useState } from 'react';

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
	const [fileLink, setFileLink] = useState<string>('');
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

	const handleDownload = useCallback(()=>{		
		const transformedText = getTransformedAsText.current();
		let type = OutputFormat.CSV;
		if(format === OutputFormat.TSV)
			type = OutputFormat.TSV
		let data = new Blob([transformedText], {type:`text/${type}`});
		let url = window.URL.createObjectURL(data);
		setFileLink(url);
	}, [format])

	return (
		<section className="flex flex-col min-w-0">
			<p className="font-bold mb-2">Output Preview</p>
			<div className="bg-white border flex rounded mb-4 p-3">
				<div className='flex items-center'>
					<label className="inline-block font-bold mr-3 my-0" htmlFor="format">
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
				<div className="ml-auto flex gap-2">
					<button className="border py-1 px-2" onClick={handleCopyEvent}>
						Copy as {format.toUpperCase()}
					</button>
					<a download='JSONReshaperdata' href={fileLink} className="border py-1 px-2" onClick={handleDownload}>
						Download {format.toUpperCase()}
					</a>
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
