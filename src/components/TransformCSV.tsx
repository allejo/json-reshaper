import { useCallback, useEffect, useMemo, useState } from 'react';

import { IOutputComponentProps } from '../contracts.ts';
import { applyReshapeTransformation } from '../utilities.ts';

type Props = IOutputComponentProps;

/**
 * @see https://stackoverflow.com/a/68146412
 */
function arrayToCsv(data: Array<Array<string>>): string {
	return data
		.map(
			(row) =>
				row
					.map(String) // convert every value to String
					.map((v) => v.replaceAll('"', '""')) // escape double colons
					.map((v) => `"${v}"`) // quote it
					.join(','), // comma-separated
		)
		.join('\r\n'); // rows starting on new lines
}

export const TransformCSV = ({
	transformManifest,
	filteredJson,
	onTransformerMount,
}: Props) => {
	const manifest = useMemo(
		() => Object.values(transformManifest),
		[transformManifest],
	);
	const [processed, setProcessed] = useState<Array<Array<string>>>([]);

	const generatedCSV = useMemo(
		() => arrayToCsv([manifest.map((c) => c.name), ...processed]),
		[manifest, processed],
	);
	const exportToCsv = useCallback(() => generatedCSV, [generatedCSV]);

	useEffect(() => {
		if (manifest.length === 0) {
			setProcessed([]);
			return;
		}

		setProcessed(
			applyReshapeTransformation(
				filteredJson,
				manifest,
				() => [],
				(col, value) => col.push(value),
			),
		);
	}, [transformManifest, filteredJson, manifest]);

	useEffect(() => {
		onTransformerMount(exportToCsv);
	}, [exportToCsv, onTransformerMount]);

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
