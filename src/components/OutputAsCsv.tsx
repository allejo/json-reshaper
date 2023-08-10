import { useEffect, useMemo, useState } from 'react';

import { IOutputComponentProps } from '../contracts.ts';
import { applyJMESPath } from '../utilities.ts';

type Props = IOutputComponentProps;

export const OutputAsCsv = ({
	transformManifest,
	filteredJson,
	onCopyOutput,
}: Props) => {
	const manifest = useMemo(
		() => Object.values(transformManifest),
		[transformManifest],
	);
	const [processed, setProcessed] = useState<Array<Array<unknown>>>([]);

	useEffect(() => {
		const result: Array<Array<unknown>> = [];

		for (const jsonElement of filteredJson) {
			const row: Array<unknown> = [];

			for (const columnDefinition of manifest) {
				const query = columnDefinition.query;

				if (query.trim() === '') {
					row.push('');
					continue;
				}

				const value = applyJMESPath(jsonElement, columnDefinition.query);

				if (value === undefined) {
					row.push('');
				} else {
					row.push(value);
				}
			}

			result.push(row);
		}

		setProcessed(result);
	}, [transformManifest, filteredJson, onCopyOutput, manifest]);

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
							{row.map((cell, cellIndex) => {
								if (typeof cell === 'object') {
									return <td key={cellIndex}>{JSON.stringify(cell)}</td>;
								}

								return <td key={cellIndex}>{cell as string}</td>;
							})}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};
