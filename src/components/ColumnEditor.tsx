import { faEllipsisVertical, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useCallback, useContext, useMemo } from 'react';

import { DocumentContext } from '../contexts.ts';
import { ColumnType } from '../ReShaperDocument.js';
import { ColumnEntry } from './ColumnEntry.tsx';

export const ColumnEditor = () => {
	const { document, setDocument } = useContext(DocumentContext);
	const rawManifest = document.manifest;
	const manifest = useMemo(
		() => Object.values(rawManifest ?? {}),
		[rawManifest],
	);

	const handleOnAdd = useCallback(() => {
		const uuid = Math.random().toString(36).substring(2, 6);

		setDocument((draft) => {
			draft?.manifest?.push({
				uuid,
				name: '',
				type: ColumnType.String,
				query: '',
			});
		});
	}, [setDocument]);
	const handleOnDelete = useCallback(
		(index: number) => {
			setDocument((draft) => {
				draft?.manifest?.splice(index, 1);
			});
		},
		[setDocument],
	);
	const handleOnEdit = useCallback(
		(index: number, name: string, value: number | string) => {
			setDocument((draft) => {
				// @ts-expect-error Every field in an IColumnDefinition can have different types (e.g. UUIDv4 vs string)
				draft.manifest[index][name] = value;

				if (name === 'type') {
					if (value === ColumnType.String) {
						const target = draft?.manifest?.[index] ?? {};

						if ('dateConversion' in target) {
							delete target.dateConversion;
						}
					} else if (value === ColumnType.Date) {
						const target = draft?.manifest?.[index];

						if (target) {
							if (!target.dateConversion) {
								target.dateConversion = {};
							}

							target.dateConversion.from = '';
							target.dateConversion.to = '';
						}
					}
				}
			});
		},
		[setDocument],
	);

	return (
		<section className="flex flex-col">
			<p className="font-bold mb-2">Output Columns</p>

			<div className="bg-white border grow overflow-hidden rounded p-3">
				<div className="grid grid-rows-[minmax(0,_1fr)_min-content] h-full">
					<button
						className="border order-2 mt-auto py-2 w-full"
						onClick={handleOnAdd}
					>
						<FontAwesomeIcon icon={faPlus} className="mr-3" fixedWidth={true} />
						Add Column
					</button>
					<div className="order-1 overflow-auto">
						<table className="table-auto w-full">
							<thead className="sticky top-0 bg-white">
								<tr className="text-left">
									<th className="text-center">
										<FontAwesomeIcon
											icon={faEllipsisVertical}
											fixedWidth={true}
										/>
										<span className="sr-only">Options</span>
									</th>
									<th className="w-1/4">Column Name</th>
									<th className="w-1/5">Data Type</th>
									<th className="w-full">Query</th>
								</tr>
							</thead>
							<tbody className="overflow-y-auto">
								{manifest.map((column, i) => (
									<ColumnEntry
										key={column.uuid}
										column={column}
										index={i}
										onChange={handleOnEdit}
										onDelete={handleOnDelete}
										onEnter={handleOnAdd}
									/>
								))}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</section>
	);
};
