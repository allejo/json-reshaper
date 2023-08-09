import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ChangeEvent, useCallback } from 'react';

export interface ColumnDefinition {
	name: string;
	type: string;
	query: string;
}

interface ColumnEntryProps {
	column: ColumnDefinition;
	index: number;
	onChange: (index: number, column: ColumnDefinition) => void;
	onDelete: (index: number) => void;
}

const ColumnEntry = ({
	column,
	index,
	onChange,
	onDelete,
}: ColumnEntryProps) => {
	const handleOnChange = useCallback(
		(key: string) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
			onChange(index, { ...column, [key]: e.currentTarget.value });
		},
		[],
	);
	const handleOnDelete = useCallback(() => {
		onDelete(index);
	}, []);

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
	columns: ColumnDefinition[];
	onColumnsChange: (columns: ColumnDefinition[]) => void;
}

export const ColumnEditor = ({ columns, onColumnsChange }: Props) => {
	const handleOnAdd = useCallback(() => {
		const newColumns = [...columns];

		newColumns.push({ name: '', query: '', type: 'string' });

		onColumnsChange(newColumns);
	}, []);
	const handleOnDelete = useCallback((index: number) => {
		const newColumns = [...columns];

		newColumns.splice(index, 1);

		onColumnsChange(newColumns);
	}, []);
	const handleOnEdit = useCallback(
		(index: number, column: ColumnDefinition) => {
			const newColumns = [...columns];

			newColumns[index] = column;
			onColumnsChange(newColumns);
		},
		[],
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
						{columns.map((column, index) => (
							<ColumnEntry
								column={column}
								index={index}
								onChange={handleOnEdit}
								onDelete={handleOnDelete}
							/>
						))}
					</tbody>
				</table>
				<button className="border py-2 w-full" onClick={handleOnAdd}>
					Add Column
				</button>
			</div>
		</section>
	);
};
