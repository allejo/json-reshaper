import { faEllipsisVertical, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useCallback, useMemo } from 'react';

import {
	ColumnType,
	DateColumn,
	StateSetter,
	StringColumn,
	TransformManifest,
	UUIDv4,
} from '../contracts.ts';
import { ColumnEntry } from './ColumnEntry.tsx';

interface Props {
	transformManifest: TransformManifest;
	onManifestChange: StateSetter<TransformManifest>;
}

export const ColumnEditor = ({
	transformManifest,
	onManifestChange,
}: Props) => {
	const manifest = useMemo(
		() => Object.values(transformManifest),
		[transformManifest],
	);

	const handleOnAdd = useCallback(() => {
		const uuid = crypto.randomUUID();

		onManifestChange((prevManifest) => ({
			...prevManifest,
			[uuid]: {
				uuid,
				name: '',
				type: ColumnType.String,
				query: '',
			},
		}));
	}, [onManifestChange]);
	const handleOnDelete = useCallback(
		(uuid: UUIDv4) => {
			onManifestChange((prevManifest) => {
				const newManifest = { ...prevManifest };
				delete newManifest[uuid];

				return newManifest;
			});
		},
		[onManifestChange],
	);
	const handleOnEdit = useCallback(
		(uuid: UUIDv4, name: string, value: string) => {
			onManifestChange((prevManifest) => {
				const updatedManifest: TransformManifest = {
					...prevManifest,
					[uuid]: {
						...prevManifest[uuid],
						[name]: value,
					},
				};

				if (name === 'type') {
					if (value === ColumnType.String) {
						const target = updatedManifest[uuid] as StringColumn;

						if ('fromFormat' in target) {
							delete target.fromFormat;
						}
						if ('toFormat' in target) {
							delete target.toFormat;
						}
					} else if (value === ColumnType.Date) {
						const target = updatedManifest[uuid] as DateColumn;

						target.fromFormat = '';
						target.toFormat = '';
					}
				}

				return updatedManifest;
			});
		},
		[onManifestChange],
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
								{manifest.map((column) => (
									<ColumnEntry
										key={column.uuid}
										column={column}
										uuid={column.uuid}
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
