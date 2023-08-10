import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ChangeEvent, useCallback, useMemo } from 'react';

import {
	ColumnDefinition,
	StateSetter,
	TransformManifest,
	UUIDv4,
} from '../contracts.ts';

interface ColumnEntryProps {
	uuid: UUIDv4;
	column: ColumnDefinition;
	onChange: (uuid: UUIDv4, name: string, value: string) => void;
	onDelete: (uuid: UUIDv4) => void;
}

const ColumnEntry = ({
	column,
	uuid,
	onChange,
	onDelete,
}: ColumnEntryProps) => {
	const handleOnChange = useCallback(
		(key: string) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
			onChange(uuid, key, e.currentTarget.value);
		},
		[onChange, uuid],
	);
	const handleOnDelete = useCallback(() => {
		onDelete(uuid);
	}, [onDelete, uuid]);

	return (
		<tr>
			<td>
				<button onClick={handleOnDelete}>
					<FontAwesomeIcon icon={faTrash} />
					<span className="sr-only">Delete</span>
				</button>
			</td>
			<td>
				<input
					type="text"
					onChange={handleOnChange('name')}
					value={column.name}
				/>
			</td>
			<td className="text-center">
				<select onChange={handleOnChange('type')} value={column.type}>
					<option>{column.type}</option>
				</select>
			</td>
			<td>
				<input
					type="text"
					onChange={handleOnChange('query')}
					value={column.query}
				/>
			</td>
		</tr>
	);
};

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
				type: 'string',
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
			onManifestChange((prevManifest) => ({
				...prevManifest,
				[uuid]: {
					...prevManifest[uuid],
					[name]: value,
				},
			}));
		},
		[onManifestChange],
	);

	return (
		<section className="flex flex-col">
			<p className="font-bold mb-2">Output Columns</p>

			<div className="bg-white border grow rounded p-3">
				<table className="mb-4 table-auto w-full">
					<thead>
						<tr className="text-left">
							<th className="sr-only">Options</th>
							<th className="w-1/4">Column Name</th>
							<th className="w-1/5">Data Type</th>
							<th className="w-full">Query</th>
						</tr>
					</thead>
					<tbody>
						{manifest.map((column) => (
							<ColumnEntry
								key={column.uuid}
								column={column}
								uuid={column.uuid}
								onChange={handleOnEdit}
								onDelete={handleOnDelete}
							/>
						))}
					</tbody>
				</table>
				<button className="border py-2 w-full" onClick={handleOnAdd}>
					<FontAwesomeIcon icon={faPlus} className="mr-3" />
					Add Column
				</button>
			</div>
		</section>
	);
};
