import { ChangeEvent, useCallback, useState } from 'react';

import { TransformManifest } from '../contracts.ts';
import { OutputAsCsv } from './OutputAsCsv.tsx';

enum OutputFormat {
	CSV = 'csv',
}

interface Props {
	columnQueries: TransformManifest;
	filteredJson: Record<symbol, unknown>[];
}

export const OutputPreview = ({ columnQueries, filteredJson }: Props) => {
	const [format, setFormat] = useState<OutputFormat>(OutputFormat.CSV);

	const handleFormatOnChange = useCallback(
		(e: ChangeEvent<HTMLSelectElement>) => {
			setFormat(e.currentTarget.value as OutputFormat);
		},
		[],
	);

	return (
		<section>
			<p className="font-bold mb-2">Output Preview</p>
			<div className="bg-white border grow rounded mb-4 p-3">
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
			</div>
			{format === OutputFormat.CSV && (
				<OutputAsCsv
					transformManifest={columnQueries}
					filteredJson={filteredJson}
					onCopyOutput={() => {}}
				/>
			)}
		</section>
	);
};
