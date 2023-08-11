import { useCallback, useEffect, useMemo, useState } from 'react';

import { IOutputComponentProps } from '../contracts.ts';
import { applyJMESPath } from '../utilities.ts';

type Props = IOutputComponentProps;

/**
 * @see https://stackoverflow.com/a/68146412
 */
function arrayToCsv(data: Array<Array<unknown>>): string {
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
	const [processed, setProcessed] = useState<Array<Array<unknown>>>([]);

	const generatedCSV = useMemo(() => arrayToCsv(processed), [processed]);
	const exportToCsv = useCallback(() => generatedCSV, [generatedCSV]);

	useEffect(() => {
		const result: Array<Array<unknown>> = [manifest.map((c) => c.name)];

		for (const jsonElement of filteredJson) {
			const row: Array<unknown> = [];

			for (const columnDefinition of manifest) {
				const query = columnDefinition.query;

				if (query.trim() === '') {
					row.push('');
					continue;
				}

				try {
					row.push(applyJMESPath(jsonElement, query));
				} catch {
					row.push(null);
				}
			}

			result.push(row);
		}

		setProcessed(result);
	}, [transformManifest, filteredJson, manifest]);

	useEffect(() => {
		onTransformerMount(exportToCsv);
	}, [exportToCsv, onTransformerMount]);

	return (
		<div className="bg-white rounded">
			<table className="min-w-full">
				<thead>
					<tr className="text-left">
						{manifest.map((column) => (
							<th key={column.uuid}>{column.name}</th>
						))}
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
		</div>
	);
};
