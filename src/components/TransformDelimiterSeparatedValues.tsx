import { useCallback, useEffect, useMemo, useState } from 'react';

import { IOutputComponentProps } from '../contracts.ts';
import { applyReshapeTransformationArray } from '../utilities.ts';

interface Props extends IOutputComponentProps {
	delimiter: string;
	setIsDisabled:React.Dispatch<React.SetStateAction<boolean>>
}

/**
 * @see https://stackoverflow.com/a/68146412
 */
function arrayToDsv(data: Array<Array<string>>, delimiter = ','): string {
	return data
		.map(
			(row) =>
				row
					.map(String) // convert every value to String
					.map((v) => v.replaceAll('"', '""')) // escape double colons
					.map((v) => `"${v}"`) // quote it
					.join(delimiter), // comma-separated
		)
		.join('\r\n'); // rows starting on new lines
}

export const TransformDelimiterSeparatedValues = ({
	delimiter,
	transformManifest,
	filteredJson,
	onTransformerMount,
	setIsDisabled,
}: Props) => {
	const manifest = useMemo(
		() => Object.values(transformManifest),
		[transformManifest],
	);
	const [processed, setProcessed] = useState<Array<Array<string>>>([]);

	const generatedDSV = useMemo(
		() => arrayToDsv([manifest.map((c) => c.name), ...processed], delimiter),
		[delimiter, manifest, processed],
	);
	const exportToDsv = useCallback(() => generatedDSV, [generatedDSV]);

	useEffect(() => {
		if (manifest.length === 0) {
			setProcessed([]);
			return;
		}
		setIsDisabled(false);
		setProcessed(applyReshapeTransformationArray(filteredJson, manifest));
	}, [transformManifest, filteredJson, manifest]);

	useEffect(() => {
		onTransformerMount(exportToDsv);
	}, [exportToDsv, onTransformerMount]);

	if (processed.length <= 1) {
		return (
			<div className="flex h-full">
				<p className="m-auto text-3xl text-gray-400">Nothing to preview yet!</p>
			</div>
		);
	}

	return (
		<table className="table-auto whitespace-nowrap">
			<thead className="sticky top-0 bg-white">
				<tr className="text-left">
					{manifest.map((column) =>
						column.name.trim() === '' ? null : (
							<th key={column.uuid}>{column.name}</th>
						),
					)}
				</tr>
			</thead>
			<tbody>
				{processed.map((row, rowIndex) => (
					<tr key={rowIndex}>
						{row.map((cell, cellIndex) => (
							<td key={cellIndex}>{String(cell)}</td>
						))}
					</tr>
				))}
			</tbody>
		</table>
	);
};
